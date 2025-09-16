import json
import re
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

class AIService:
    def analyze_resume(self, resume_text, job_description):
        """Analyze resume against job description"""
        # Extract skills
        skills = self.extract_skills(resume_text)
        
        # Calculate match score
        match_score = self.calculate_match_score(resume_text, job_description)
        
        # Extract experience
        experience_years = self.extract_experience(resume_text)
        
        # Generate summary
        summary = f"Professional candidate with {experience_years} years of experience and strong skills in {', '.join(skills[:3])}."
        
        # Analyze strengths/weaknesses
        strengths = skills[:3] if skills else ["Technical expertise", "Problem solving"]
        weaknesses = ["Communication skills", "Leadership experience"] if len(skills) < 5 else []
        
        return {
            "match_score": match_score,
            "key_skills": skills,
            "experience_years": experience_years,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "summary": summary
        }
    
    def rank_candidates(self, candidates, job_requirements):
        """Rank candidates based on job requirements"""
        ranked = []
        
        for candidate in candidates:
            score = self.calculate_candidate_score(candidate, job_requirements)
            candidate_with_score = {**candidate, "ai_score": score}
            ranked.append(candidate_with_score)
        
        ranked.sort(key=lambda x: x["ai_score"], reverse=True)
        
        return {
            "ranked_candidates": ranked,
            "ranking_criteria": {
                "skills_weight": 0.4,
                "experience_weight": 0.3,
                "education_weight": 0.2,
                "cultural_fit_weight": 0.1
            }
        }
    
    def analyze_bias(self, hiring_data):
        """Analyze bias in hiring data"""
        if not hiring_data:
            return {"bias_score": 0, "bias_indicators": {}, "recommendations": []}
        
        # Simple bias analysis
        total_candidates = len(hiring_data)
        hired_count = sum(1 for h in hiring_data if h.get("hired", False))
        
        bias_score = abs(50 - (hired_count / total_candidates * 100)) if total_candidates > 0 else 0
        
        recommendations = [
            "Implement structured interviews",
            "Use diverse interview panels",
            "Monitor hiring patterns regularly"
        ]
        
        return {
            "bias_score": bias_score,
            "bias_indicators": {"overall_variance": bias_score / 100},
            "recommendations": recommendations
        }
    
    def analyze_sentiment(self, text, context):
        """Analyze sentiment of text"""
        positive_words = ["excellent", "great", "good", "positive", "excited", "enthusiastic"]
        negative_words = ["bad", "poor", "negative", "concerned", "worried"]
        
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
        
        engagement_score = min(len(text) / 100, 1.0) * 100
        
        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "emotions": {"enthusiasm": positive_count, "concern": negative_count},
            "engagement_score": engagement_score
        }
    
    def extract_skills(self, text):
        """Extract skills from text"""
        common_skills = [
            "Python", "JavaScript", "Java", "React", "Node.js", "SQL", "AWS", "Docker",
            "Kubernetes", "Machine Learning", "Data Science", "Project Management",
            "Leadership", "Communication", "Problem Solving", "Teamwork", "Git",
            "HTML", "CSS", "TypeScript", "Angular", "Vue", "MongoDB", "PostgreSQL"
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in common_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills[:8]
    
    def calculate_match_score(self, resume_text, job_description):
        """Calculate similarity score between resume and job description"""
        resume_words = set(resume_text.lower().split())
        job_words = set(job_description.lower().split())
        
        intersection = resume_words.intersection(job_words)
        union = resume_words.union(job_words)
        
        if len(union) == 0:
            return 0
        
        similarity = len(intersection) / len(union)
        return min(similarity * 100, 95)
    
    def extract_experience(self, text):
        """Extract years of experience from text"""
        patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'(\d+)\+?\s*years?\s*in',
            r'experience\s*:\s*(\d+)\+?\s*years?'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        
        return 2  # Default experience
    
    def calculate_candidate_score(self, candidate, job_requirements):
        """Calculate overall candidate score"""
        score = 0.0
        
        # Skills matching (40% weight)
        candidate_skills = candidate.get("skills", [])
        required_skills = job_requirements.get("required_skills", [])
        if required_skills:
            skill_match = len(set(candidate_skills).intersection(set(required_skills)))
            skill_score = (skill_match / len(required_skills)) * 40
            score += skill_score
        
        # Experience (30% weight)
        candidate_exp = candidate.get("experience_years", 0)
        required_exp = job_requirements.get("min_experience", 0)
        if required_exp > 0:
            exp_score = min(candidate_exp / required_exp, 1.0) * 30
            score += exp_score
        
        # Education (20% weight)
        score += 20 if candidate.get("education_level") == job_requirements.get("education_level") else 10
        
        # Cultural fit (10% weight)
        score += 10
        
        return min(score, 100)

class AIRequestHandler(BaseHTTPRequestHandler):
    ai_service = AIService()
    
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "healthy", "service": "ai-ml-service"}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            if self.path == '/analyze-resume':
                result = self.ai_service.analyze_resume(
                    data.get('resume_text', ''),
                    data.get('job_description', '')
                )
            elif self.path == '/rank-candidates':
                result = self.ai_service.rank_candidates(
                    data.get('candidates', []),
                    data.get('job_requirements', {})
                )
            elif self.path == '/analyze-bias':
                result = self.ai_service.analyze_bias(data.get('hiring_data', []))
            elif self.path == '/analyze-sentiment':
                result = self.ai_service.analyze_sentiment(
                    data.get('text', ''),
                    data.get('context', '')
                )
            else:
                self.send_response(404)
                self.end_headers()
                return
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, AIRequestHandler)
    print("AI ML Service running on http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()