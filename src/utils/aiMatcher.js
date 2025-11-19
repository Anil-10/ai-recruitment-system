// AI Resume Screening & Matching with NLP techniques
export class AIResumeScreener {
  constructor() {
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did'
    ]);
    
    this.skillKeywords = [
      'javascript', 'python', 'java', 'react', 'nodejs', 'angular', 'vue', 'html', 'css',
      'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes', 'git',
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'django', 'flask',
      'spring', 'express', 'restapi', 'graphql', 'microservices', 'agile', 'scrum'
    ];
  }

  // Clean and preprocess text
  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Extract keywords from text
  extractKeywords(text) {
    const words = this.cleanText(text).split(' ');
    return words.filter(word => 
      word.length > 2 && 
      !this.stopWords.has(word) &&
      /^[a-zA-Z]+$/.test(word)
    );
  }

  // TF-IDF calculation
  calculateTFIDF(text, corpus) {
    const words = this.extractKeywords(text);
    const wordCount = words.length;
    const tf = {};
    
    // Term Frequency
    words.forEach(word => {
      tf[word] = (tf[word] || 0) + 1;
    });
    
    Object.keys(tf).forEach(word => {
      tf[word] = tf[word] / wordCount;
    });
    
    // IDF (simplified)
    const idf = {};
    Object.keys(tf).forEach(word => {
      const docCount = corpus.filter(doc => 
        this.cleanText(doc).includes(word)
      ).length;
      idf[word] = Math.log(corpus.length / (docCount + 1));
    });
    
    // TF-IDF
    const tfidf = {};
    Object.keys(tf).forEach(word => {
      tfidf[word] = tf[word] * idf[word];
    });
    
    return tfidf;
  }

  // Cosine similarity between two TF-IDF vectors
  cosineSimilarity(vec1, vec2) {
    const allWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allWords.forEach(word => {
      const val1 = vec1[word] || 0;
      const val2 = vec2[word] || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2)) || 0;
  }

  // TF-IDF based matching
  tfidfMatchScore(resumeText, jobDescText) {
    const corpus = [resumeText, jobDescText];
    const resumeTFIDF = this.calculateTFIDF(resumeText, corpus);
    const jobTFIDF = this.calculateTFIDF(jobDescText, corpus);
    
    const similarity = this.cosineSimilarity(resumeTFIDF, jobTFIDF);
    return Math.round(similarity * 100);
  }

  // Keyword overlap scoring
  keywordOverlapScore(resumeText, jobDescText) {
    const resumeKeywords = new Set(this.extractKeywords(resumeText));
    const jobKeywords = new Set(this.extractKeywords(jobDescText));
    
    const intersection = new Set([...resumeKeywords].filter(x => jobKeywords.has(x)));
    const union = new Set([...resumeKeywords, ...jobKeywords]);
    
    return Math.round((intersection.size / jobKeywords.size) * 100);
  }

  // Skills matching
  skillsMatchScore(resumeText, jobDescText) {
    const resumeText_clean = this.cleanText(resumeText);
    const jobDescText_clean = this.cleanText(jobDescText);
    
    const resumeSkills = this.skillKeywords.filter(skill => 
      resumeText_clean.includes(skill)
    );
    const jobSkills = this.skillKeywords.filter(skill => 
      jobDescText_clean.includes(skill)
    );
    
    const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
    
    return {
      score: jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0,
      resumeSkills,
      jobSkills,
      matchedSkills
    };
  }

  // Semantic similarity (simplified BERT-like approach)
  semanticSimilarity(resumeText, jobDescText) {
    // Simplified semantic matching using word embeddings concept
    const resumeWords = this.extractKeywords(resumeText);
    const jobWords = this.extractKeywords(jobDescText);
    
    // Calculate semantic overlap based on word stems and related terms
    let semanticMatches = 0;
    const totalJobWords = jobWords.length;
    
    jobWords.forEach(jobWord => {
      const hasExactMatch = resumeWords.includes(jobWord);
      const hasStemMatch = resumeWords.some(resumeWord => 
        this.areSimilarWords(resumeWord, jobWord)
      );
      
      if (hasExactMatch || hasStemMatch) {
        semanticMatches++;
      }
    });
    
    return Math.round((semanticMatches / totalJobWords) * 100);
  }

  // Check if words are semantically similar
  areSimilarWords(word1, word2) {
    // Simple similarity check based on common stems and synonyms
    const synonyms = {
      'develop': ['build', 'create', 'code', 'program'],
      'manage': ['lead', 'supervise', 'coordinate', 'oversee'],
      'design': ['create', 'build', 'architect', 'plan'],
      'analyze': ['examine', 'study', 'review', 'assess'],
      'implement': ['execute', 'deploy', 'develop', 'build']
    };
    
    // Check if words share common root (simplified)
    if (word1.length > 4 && word2.length > 4) {
      const root1 = word1.substring(0, 4);
      const root2 = word2.substring(0, 4);
      if (root1 === root2) return true;
    }
    
    // Check synonyms
    for (const [key, values] of Object.entries(synonyms)) {
      if ((word1 === key && values.includes(word2)) || 
          (word2 === key && values.includes(word1))) {
        return true;
      }
    }
    
    return false;
  }

  // Overall matching score with weighted components
  calculateOverallScore(resumeText, jobDescText) {
    const tfidfScore = this.tfidfMatchScore(resumeText, jobDescText);
    const keywordScore = this.keywordOverlapScore(resumeText, jobDescText);
    const skillsResult = this.skillsMatchScore(resumeText, jobDescText);
    const semanticScore = this.semanticSimilarity(resumeText, jobDescText);
    
    // Weighted average
    const overallScore = Math.round(
      0.25 * tfidfScore + 
      0.25 * keywordScore + 
      0.30 * skillsResult.score + 
      0.20 * semanticScore
    );
    
    return {
      overallScore,
      breakdown: {
        tfidf: tfidfScore,
        keywords: keywordScore,
        skills: skillsResult.score,
        semantic: semanticScore
      },
      skillsAnalysis: skillsResult,
      recommendations: this.generateRecommendations(resumeText, jobDescText, overallScore)
    };
  }

  // Generate improvement recommendations
  generateRecommendations(resumeText, jobDescText, score) {
    const recommendations = [];
    const skillsResult = this.skillsMatchScore(resumeText, jobDescText);
    
    if (score < 70) {
      recommendations.push('Consider adding more relevant keywords from the job description');
    }
    
    if (skillsResult.score < 60) {
      const missingSkills = skillsResult.jobSkills.filter(skill => 
        !skillsResult.matchedSkills.includes(skill)
      );
      if (missingSkills.length > 0) {
        recommendations.push(`Add these missing skills: ${missingSkills.slice(0, 3).join(', ')}`);
      }
    }
    
    if (!resumeText.toLowerCase().includes('project')) {
      recommendations.push('Include specific project examples');
    }
    
    if (!/\d+%|\d+x|increased|improved|reduced/i.test(resumeText)) {
      recommendations.push('Add quantifiable achievements (e.g., "Increased performance by 40%")');
    }
    
    return recommendations;
  }

  // Rank multiple candidates
  rankCandidates(candidates, jobDescription) {
    return candidates
      .map(candidate => ({
        ...candidate,
        matchResult: this.calculateOverallScore(candidate.resumeText, jobDescription)
      }))
      .sort((a, b) => b.matchResult.overallScore - a.matchResult.overallScore);
  }
}