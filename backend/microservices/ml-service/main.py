from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import requests
import PyPDF2
import docx
import io
import re
import os
import openai
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Hiring ML Service",
    description="Advanced ML service for resume screening and candidate analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Load ML models
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english", aggregation_strategy="simple")
    logger.info("ML models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load ML models: {e}")
    model = None
    ner_pipeline = None

# OpenAI configuration
openai.api_key = os.getenv('OPENAI_API_KEY')

class ScreeningRequest(BaseModel):
    job: Dict[str, Any]
    candidate: Dict[str, Any]
    coverLetter: str = None

class ScreeningResponse(BaseModel):
    fitScore: float
    details: Dict[str, Any]

def extract_text_from_pdf(url: str) -> str:
    """Extract text from PDF file"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        with io.BytesIO(response.content) as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_docx(url: str) -> str:
    """Extract text from DOCX file"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        with io.BytesIO(response.content) as docx_file:
            doc = docx.Document(docx_file)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from DOCX: {str(e)}")

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using pattern matching"""
    skills_patterns = {
        'python': r'\bpython\b',
        'javascript': r'\bjavascript\b|\bjs\b',
        'java': r'\bjava\b',
        'react': r'\breact\b',
        'node': r'\bnode\.?js\b',
        'sql': r'\bsql\b',
        'aws': r'\baws\b',
        'docker': r'\bdocker\b',
        'kubernetes': r'\bkubernetes\b|\bk8s\b',
        'typescript': r'\btypescript\b|\bts\b',
        'angular': r'\bangular\b',
        'vue': r'\bvue\b',
        'django': r'\bdjango\b',
        'flask': r'\bflask\b',
        'fastapi': r'\bfastapi\b',
        'spring': r'\bspring\b',
        'mongodb': r'\bmongodb\b',
        'postgresql': r'\bpostgresql\b|\bpostgres\b',
        'redis': r'\bredis\b',
        'git': r'\bgit\b',
        'linux': r'\blinux\b',
        'azure': r'\bazure\b',
        'gcp': r'\bgcp\b|\bgoogle cloud\b',
    }
    
    found_skills = []
    text_lower = text.lower()
    
    for skill, pattern in skills_patterns.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            found_skills.append(skill)
    
    return list(set(found_skills))

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between two texts"""
    embedding1 = model.encode(text1, convert_to_tensor=True)
    embedding2 = model.encode(text2, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(embedding1, embedding2)
    return similarity.item()

def calculate_skill_similarity(job_skills: List[str], candidate_skills: List[str]) -> float:
    """Calculate skill similarity using TF-IDF"""
    all_skills = list(set(job_skills + candidate_skills))
    
    # Create skill vectors
    job_text = " ".join(job_skills)
    candidate_text = " ".join(candidate_skills)
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([job_text, candidate_text])
    
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return similarity[0][0]

@app.post("/screen", response_model=ScreeningResponse)
async def screen_application(request: ScreeningRequest):
    try:
        # Extract text from resume
        resume_url = request.candidate.get('resumeUrl')
        if not resume_url:
            raise HTTPException(status_code=400, detail="Resume URL is required")
        
        if resume_url.endswith('.pdf'):
            resume_text = extract_text_from_pdf(resume_url)
        elif resume_url.endswith('.docx') or resume_url.endswith('.doc'):
            resume_text = extract_text_from_docx(resume_url)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Extract skills from resume
        extracted_skills = extract_skills(resume_text)
        all_candidate_skills = list(set(request.candidate.get('skills', []) + extracted_skills))
        
        # Prepare texts for similarity calculation
        job_text = f"{request.job['title']} {request.job['description']} {' '.join(request.job['skills'])}"
        candidate_text = f"{' '.join(all_candidate_skills)} {resume_text}"
        if request.coverLetter:
            candidate_text += f" {request.coverLetter}"
        
        # Calculate similarities
        semantic_similarity = calculate_semantic_similarity(job_text, candidate_text)
        skill_similarity = calculate_skill_similarity(request.job['skills'], all_candidate_skills)
        
        # Experience match
        experience_match = min(request.candidate.get('yearsExp', 0) / max(request.job['experience'], 1), 1.0)
        
        # Calculate final fit score (weighted average)
        weights = {
            'semantic': 0.4,
            'skills': 0.4,
            'experience': 0.2
        }
        
        fit_score = (
            semantic_similarity * weights['semantic'] +
            skill_similarity * weights['skills'] +
            experience_match * weights['experience']
        )
        
        # Ensure score is between 0 and 1
        fit_score = max(0, min(1, fit_score))
        
        return ScreeningResponse(
            fitScore=fit_score,
            details={
                "semanticSimilarity": semantic_similarity,
                "skillSimilarity": skill_similarity,
                "experienceMatch": experience_match,
                "extractedSkills": extracted_skills,
                "allCandidateSkills": all_candidate_skills,
                "jobSkills": request.job['skills'],
                "resumeLength": len(resume_text),
                "weights": weights
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Screening failed: {str(e)}")

def extract_skills_with_ner(text: str) -> List[str]:
    """Extract skills using NER pipeline"""
    if not ner_pipeline:
        return extract_skills(text)
    
    try:
        entities = ner_pipeline(text)
        skills = []
        for entity in entities:
            if entity['entity_group'] in ['MISC', 'ORG'] and len(entity['word']) > 2:
                skills.append(entity['word'].lower())
        return list(set(skills))
    except Exception as e:
        logger.error(f"NER extraction failed: {e}")
        return extract_skills(text)

async def generate_interview_questions_openai(job_title: str, job_description: str, candidate_skills: List[str]) -> List[str]:
    """Generate interview questions using OpenAI"""
    if not openai.api_key:
        return []
    
    try:
        prompt = f"""Generate 5 technical interview questions for a {job_title} position.
        
Job Description: {job_description}
Candidate Skills: {', '.join(candidate_skills)}

Focus on:
1. Technical competency
2. Problem-solving abilities
3. Role-specific scenarios
4. Skill assessment

Return only the questions, numbered 1-5."""

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        
        questions = response.choices[0].message.content.split('\n')
        return [q.strip() for q in questions if q.strip() and any(char.isdigit() for char in q[:3])]
    except Exception as e:
        logger.error(f"OpenAI question generation failed: {e}")
        return []

class AdvancedScreeningRequest(BaseModel):
    job: Dict[str, Any]
    candidate: Dict[str, Any]
    coverLetter: Optional[str] = None
    generateQuestions: bool = False

class AdvancedScreeningResponse(BaseModel):
    fitScore: float
    details: Dict[str, Any]
    interviewQuestions: Optional[List[str]] = None

@app.post("/advanced-screen", response_model=AdvancedScreeningResponse)
async def advanced_screen_application(request: AdvancedScreeningRequest):
    """Advanced screening with AI-powered analysis"""
    try:
        # Extract text from resume
        resume_url = request.candidate.get('resumeUrl')
        if not resume_url:
            raise HTTPException(status_code=400, detail="Resume URL is required")
        
        if resume_url.endswith('.pdf'):
            resume_text = extract_text_from_pdf(resume_url)
        elif resume_url.endswith('.docx') or resume_url.endswith('.doc'):
            resume_text = extract_text_from_docx(resume_url)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Extract skills using both methods
        pattern_skills = extract_skills(resume_text)
        ner_skills = extract_skills_with_ner(resume_text)
        all_extracted_skills = list(set(pattern_skills + ner_skills))
        
        all_candidate_skills = list(set(request.candidate.get('skills', []) + all_extracted_skills))
        
        # Prepare texts for similarity calculation
        job_text = f"{request.job['title']} {request.job['description']} {' '.join(request.job['skills'])}"
        candidate_text = f"{' '.join(all_candidate_skills)} {resume_text}"
        if request.coverLetter:
            candidate_text += f" {request.coverLetter}"
        
        # Calculate similarities
        semantic_similarity = calculate_semantic_similarity(job_text, candidate_text)
        skill_similarity = calculate_skill_similarity(request.job['skills'], all_candidate_skills)
        
        # Experience match with better scoring
        required_exp = request.job.get('experience', 0)
        candidate_exp = request.candidate.get('yearsExp', 0)
        
        if required_exp == 0:
            experience_match = 1.0
        elif candidate_exp >= required_exp:
            experience_match = min(1.0, candidate_exp / required_exp)
        else:
            experience_match = max(0.3, candidate_exp / required_exp)
        
        # Calculate final fit score with improved weights
        weights = {
            'semantic': 0.35,
            'skills': 0.45,
            'experience': 0.20
        }
        
        fit_score = (
            semantic_similarity * weights['semantic'] +
            skill_similarity * weights['skills'] +
            experience_match * weights['experience']
        )
        
        fit_score = max(0, min(1, fit_score))
        
        # Generate interview questions if requested
        interview_questions = None
        if request.generateQuestions:
            interview_questions = await generate_interview_questions_openai(
                request.job['title'],
                request.job['description'],
                all_candidate_skills
            )
        
        return AdvancedScreeningResponse(
            fitScore=fit_score,
            details={
                "semanticSimilarity": semantic_similarity,
                "skillSimilarity": skill_similarity,
                "experienceMatch": experience_match,
                "patternSkills": pattern_skills,
                "nerSkills": ner_skills,
                "allCandidateSkills": all_candidate_skills,
                "jobSkills": request.job['skills'],
                "resumeLength": len(resume_text),
                "weights": weights,
                "candidateExperience": candidate_exp,
                "requiredExperience": required_exp
            },
            interviewQuestions=interview_questions
        )
        
    except Exception as e:
        logger.error(f"Advanced screening failed: {e}")
        raise HTTPException(status_code=500, detail=f"Advanced screening failed: {str(e)}")

@app.post("/extract-skills")
async def extract_skills_endpoint(text: str):
    """Extract skills from text using multiple methods"""
    pattern_skills = extract_skills(text)
    ner_skills = extract_skills_with_ner(text)
    
    return {
        "patternSkills": pattern_skills,
        "nerSkills": ner_skills,
        "combinedSkills": list(set(pattern_skills + ner_skills))
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models": {
            "sentence_transformer": model is not None,
            "ner_pipeline": ner_pipeline is not None,
            "openai_configured": openai.api_key is not None
        },
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "service": "AI Hiring ML Service",
        "version": "1.0.0",
        "endpoints": [
            "/screen",
            "/advanced-screen", 
            "/extract-skills",
            "/health",
            "/docs"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)