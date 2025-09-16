from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

app = FastAPI(title="AI Hiring ML Service", version="1.0.0")

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class CandidateRankingRequest(BaseModel):
    candidates: List[Dict]
    job_requirements: Dict

class BiasAnalysisRequest(BaseModel):
    hiring_data: List[Dict]

class SentimentAnalysisRequest(BaseModel):
    text: str
    context: str

class ResumeAnalysisResponse(BaseModel):
    match_score: float
    key_skills: List[str]
    experience_years: int
    strengths: List[str]
    weaknesses: List[str]
    summary: str

class CandidateRankingResponse(BaseModel):
    ranked_candidates: List[Dict]
    ranking_criteria: Dict

class BiasAnalysisResponse(BaseModel):
    bias_score: float
    bias_indicators: Dict
    recommendations: List[str]

class SentimentAnalysisResponse(BaseModel):
    sentiment: str
    confidence: float
    emotions: Dict
    engagement_score: float

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-ml-service"}

@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    try:
        # Extract skills using NLP
        skills = extract_skills(request.resume_text)
        
        # Calculate match score
        match_score = calculate_match_score(request.resume_text, request.job_description)
        
        # Extract experience
        experience_years = extract_experience(request.resume_text)
        
        # Generate AI summary
        summary = await generate_ai_summary(request.resume_text, request.job_description)
        
        # Identify strengths and weaknesses
        strengths, weaknesses = analyze_strengths_weaknesses(request.resume_text, request.job_description)
        
        return ResumeAnalysisResponse(
            match_score=match_score,
            key_skills=skills,
            experience_years=experience_years,
            strengths=strengths,
            weaknesses=weaknesses,
            summary=summary
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rank-candidates", response_model=CandidateRankingResponse)
async def rank_candidates(request: CandidateRankingRequest):
    try:
        ranked_candidates = []
        
        for candidate in request.candidates:
            score = calculate_candidate_score(candidate, request.job_requirements)
            candidate_with_score = {**candidate, "ai_score": score}
            ranked_candidates.append(candidate_with_score)
        
        # Sort by score
        ranked_candidates.sort(key=lambda x: x["ai_score"], reverse=True)
        
        ranking_criteria = {
            "skills_weight": 0.4,
            "experience_weight": 0.3,
            "education_weight": 0.2,
            "cultural_fit_weight": 0.1
        }
        
        return CandidateRankingResponse(
            ranked_candidates=ranked_candidates,
            ranking_criteria=ranking_criteria
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-bias", response_model=BiasAnalysisResponse)
async def analyze_bias(request: BiasAnalysisRequest):
    try:
        bias_indicators = detect_bias_patterns(request.hiring_data)
        bias_score = calculate_bias_score(bias_indicators)
        recommendations = generate_bias_recommendations(bias_indicators)
        
        return BiasAnalysisResponse(
            bias_score=bias_score,
            bias_indicators=bias_indicators,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-sentiment", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    try:
        sentiment_result = analyze_text_sentiment(request.text)
        emotions = extract_emotions(request.text)
        engagement_score = calculate_engagement_score(request.text, request.context)
        
        return SentimentAnalysisResponse(
            sentiment=sentiment_result["sentiment"],
            confidence=sentiment_result["confidence"],
            emotions=emotions,
            engagement_score=engagement_score
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def extract_skills(resume_text: str) -> List[str]:
    """Extract skills from resume text using pattern matching and NLP"""
    common_skills = [
        "Python", "JavaScript", "Java", "React", "Node.js", "SQL", "AWS", "Docker",
        "Kubernetes", "Machine Learning", "Data Science", "Project Management",
        "Leadership", "Communication", "Problem Solving", "Teamwork"
    ]
    
    found_skills = []
    resume_lower = resume_text.lower()
    
    for skill in common_skills:
        if skill.lower() in resume_lower:
            found_skills.append(skill)
    
    return found_skills[:10]  # Return top 10 skills

def calculate_match_score(resume_text: str, job_description: str) -> float:
    """Calculate similarity score between resume and job description"""
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return float(similarity[0][0] * 100)

def extract_experience(resume_text: str) -> int:
    """Extract years of experience from resume"""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
        r'(\d+)\+?\s*years?\s*in',
        r'experience\s*:\s*(\d+)\+?\s*years?'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, resume_text.lower())
        if matches:
            return int(matches[0])
    
    return 0

async def generate_ai_summary(resume_text: str, job_description: str) -> str:
    """Generate AI-powered summary using OpenAI"""
    try:
        if not openai.api_key:
            return "Professional candidate with relevant experience and skills matching the job requirements."
        
        prompt = f"""
        Analyze this resume against the job description and provide a concise professional summary:
        
        Resume: {resume_text[:1000]}
        Job Description: {job_description[:500]}
        
        Provide a 2-sentence professional summary focusing on key strengths and job fit.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100
        )
        
        return response.choices[0].message.content.strip()
    except:
        return "Experienced professional with strong technical skills and relevant background for this position."

def analyze_strengths_weaknesses(resume_text: str, job_description: str) -> tuple:
    """Analyze candidate strengths and potential gaps"""
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_description))
    
    strengths = list(resume_skills.intersection(job_skills))
    weaknesses = list(job_skills - resume_skills)
    
    return strengths[:5], weaknesses[:3]

def calculate_candidate_score(candidate: Dict, job_requirements: Dict) -> float:
    """Calculate overall candidate score based on multiple factors"""
    score = 0.0
    
    # Skills matching (40% weight)
    candidate_skills = candidate.get("skills", [])
    required_skills = job_requirements.get("required_skills", [])
    skill_match = len(set(candidate_skills).intersection(set(required_skills)))
    skill_score = (skill_match / max(len(required_skills), 1)) * 40
    
    # Experience (30% weight)
    candidate_exp = candidate.get("experience_years", 0)
    required_exp = job_requirements.get("min_experience", 0)
    exp_score = min(candidate_exp / max(required_exp, 1), 1.0) * 30
    
    # Education (20% weight)
    education_score = 20 if candidate.get("education_level") == job_requirements.get("education_level") else 10
    
    # Cultural fit (10% weight) - simplified
    cultural_score = 10
    
    return score + skill_score + exp_score + education_score + cultural_score

def detect_bias_patterns(hiring_data: List[Dict]) -> Dict:
    """Detect potential bias patterns in hiring data"""
    if not hiring_data:
        return {}
    
    df = pd.DataFrame(hiring_data)
    bias_indicators = {}
    
    # Gender bias analysis
    if 'gender' in df.columns and 'hired' in df.columns:
        gender_hire_rate = df.groupby('gender')['hired'].mean()
        bias_indicators['gender_bias'] = {
            'hire_rates': gender_hire_rate.to_dict(),
            'variance': float(gender_hire_rate.var())
        }
    
    # Age bias analysis
    if 'age' in df.columns and 'hired' in df.columns:
        age_groups = pd.cut(df['age'], bins=[0, 30, 40, 50, 100], labels=['<30', '30-40', '40-50', '50+'])
        age_hire_rate = df.groupby(age_groups)['hired'].mean()
        bias_indicators['age_bias'] = {
            'hire_rates': age_hire_rate.to_dict(),
            'variance': float(age_hire_rate.var())
        }
    
    return bias_indicators

def calculate_bias_score(bias_indicators: Dict) -> float:
    """Calculate overall bias score (0-100, lower is better)"""
    if not bias_indicators:
        return 0.0
    
    total_variance = 0.0
    count = 0
    
    for indicator, data in bias_indicators.items():
        if 'variance' in data:
            total_variance += data['variance']
            count += 1
    
    if count == 0:
        return 0.0
    
    # Convert variance to bias score (higher variance = higher bias)
    avg_variance = total_variance / count
    bias_score = min(avg_variance * 100, 100)
    
    return float(bias_score)

def generate_bias_recommendations(bias_indicators: Dict) -> List[str]:
    """Generate recommendations to reduce bias"""
    recommendations = []
    
    for indicator, data in bias_indicators.items():
        if 'variance' in data and data['variance'] > 0.1:
            if 'gender' in indicator:
                recommendations.append("Implement blind resume screening to reduce gender bias")
                recommendations.append("Ensure diverse interview panels")
            elif 'age' in indicator:
                recommendations.append("Focus on skills and experience rather than graduation dates")
                recommendations.append("Use structured interviews with standardized questions")
    
    if not recommendations:
        recommendations.append("Continue monitoring hiring patterns for bias")
        recommendations.append("Maintain diverse candidate pipelines")
    
    return recommendations

def analyze_text_sentiment(text: str) -> Dict:
    """Analyze sentiment of text (simplified implementation)"""
    positive_words = ["excellent", "great", "good", "positive", "excited", "enthusiastic", "motivated"]
    negative_words = ["bad", "poor", "negative", "concerned", "worried", "disappointed"]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        sentiment = "positive"
        confidence = min(positive_count / (positive_count + negative_count + 1), 0.95)
    elif negative_count > positive_count:
        sentiment = "negative"
        confidence = min(negative_count / (positive_count + negative_count + 1), 0.95)
    else:
        sentiment = "neutral"
        confidence = 0.5
    
    return {"sentiment": sentiment, "confidence": confidence}

def extract_emotions(text: str) -> Dict:
    """Extract emotional indicators from text"""
    emotions = {
        "enthusiasm": len(re.findall(r'excited|enthusiastic|passionate|love', text.lower())),
        "confidence": len(re.findall(r'confident|sure|certain|believe', text.lower())),
        "concern": len(re.findall(r'concerned|worried|unsure|doubt', text.lower()))
    }
    
    total = sum(emotions.values()) or 1
    return {k: v/total for k, v in emotions.items()}

def calculate_engagement_score(text: str, context: str) -> float:
    """Calculate engagement score based on text analysis"""
    # Length factor
    length_score = min(len(text) / 500, 1.0) * 0.3
    
    # Question asking (shows engagement)
    question_score = min(text.count('?') / 3, 1.0) * 0.3
    
    # Specific mentions (shows research)
    context_words = context.lower().split()
    specific_mentions = sum(1 for word in context_words if word in text.lower())
    mention_score = min(specific_mentions / 5, 1.0) * 0.4
    
    return (length_score + question_score + mention_score) * 100

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)