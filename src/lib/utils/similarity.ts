// ============================================================
// Similarity Calculation Utilities
// Advanced algorithms for duplicate detection
// ============================================================

/**
 * Calculate Levenshtein distance between two strings
 * Returns the minimum number of edits needed to transform one string into another
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 0
  if (s1.length === 0) return s2.length
  if (s2.length === 0) return s1.length

  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[s2.length][s1.length]
}

/**
 * Calculate similarity percentage based on Levenshtein distance
 * Returns 0-100 where 100 is identical
 */
export function levenshteinSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2)
  const maxLength = Math.max(str1.length, str2.length)
  if (maxLength === 0) return 100
  return ((maxLength - distance) / maxLength) * 100
}

/**
 * Simple Soundex implementation for phonetic matching
 * Converts names to phonetic codes for comparison
 */
export function soundex(name: string): string {
  const s = name.toUpperCase().replace(/[^A-Z]/g, '')
  if (s.length === 0) return ''

  const firstLetter = s[0]
  const codes: Record<string, string> = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6'
  }

  let soundexCode = firstLetter
  let prevCode = codes[firstLetter] || '0'

  for (let i = 1; i < s.length && soundexCode.length < 4; i++) {
    const code = codes[s[i]] || '0'
    if (code !== '0' && code !== prevCode) {
      soundexCode += code
      prevCode = code
    } else if (code === '0') {
      prevCode = '0'
    }
  }

  return soundexCode.padEnd(4, '0')
}

/**
 * Check if two names are phonetically similar
 */
export function phoneticMatch(name1: string, name2: string): boolean {
  return soundex(name1) === soundex(name2)
}

/**
 * Calculate similarity between two National ID numbers
 * Returns 0-100 based on matching characters
 */
export function nationalIdSimilarity(id1: string, id2: string): number {
  if (!id1 || !id2) return 0
  if (id1 === id2) return 100

  // Count matching characters at same position
  let matches = 0
  const minLength = Math.min(id1.length, id2.length)
  
  for (let i = 0; i < minLength; i++) {
    if (id1[i] === id2[i]) matches++
  }

  return (matches / Math.max(id1.length, id2.length)) * 100
}

/**
 * Calculate similarity between two dates
 * Returns 100 if exact match, decreases based on day difference
 */
export function dateSimilarity(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
  if (d1.getTime() === d2.getTime()) return 100

  // Calculate day difference
  const dayDiff = Math.abs((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
  
  // Exact match = 100, 1 day off = 95, 7 days = 75, 30 days = 50, 365+ days = 0
  if (dayDiff === 0) return 100
  if (dayDiff <= 1) return 95
  if (dayDiff <= 7) return 85
  if (dayDiff <= 30) return 70
  if (dayDiff <= 90) return 50
  if (dayDiff <= 365) return 25
  return 0
}

/**
 * Calculate address similarity using Levenshtein
 */
export function addressSimilarity(addr1: string | null, addr2: string | null): number {
  if (!addr1 || !addr2) return 0
  return levenshteinSimilarity(addr1, addr2)
}

/**
 * Composite similarity score for duplicate detection
 * Uses weighted average of multiple factors
 */
export interface SimilarityResult {
  overallScore: number
  nameSimilarity: number
  namePhonetic: boolean
  dobSimilarity: number
  nationalIdSimilarity: number
  addressSimilarity: number
  matchingFields: string[]
}

export function calculateCompositeSimilarity(
  recordA: {
    full_name: string
    date_of_birth: string
    national_id_number: string
    address?: string | null
  },
  recordB: {
    full_name: string
    date_of_birth: string
    national_id_number: string
    address?: string | null
  }
): SimilarityResult {
  // Calculate individual similarities
  const nameSim = levenshteinSimilarity(recordA.full_name, recordB.full_name)
  const phoneticSim = phoneticMatch(recordA.full_name, recordB.full_name)
  const dobSim = dateSimilarity(recordA.date_of_birth, recordB.date_of_birth)
  const idSim = nationalIdSimilarity(recordA.national_id_number, recordB.national_id_number)
  const addrSim = addressSimilarity(recordA.address, recordB.address)

  // Weighted composite score
  const weights = {
    name: 0.35,        // 35% - Most important
    phonetic: 0.05,    // 5% - Bonus for phonetic match
    dob: 0.30,         // 30% - Very important
    nationalId: 0.25,  // 25% - Important
    address: 0.05      // 5% - Nice to have
  }

  let score = 0
  score += nameSim * weights.name
  score += (phoneticSim ? 100 : 0) * weights.phonetic
  score += dobSim * weights.dob
  score += idSim * weights.nationalId
  score += addrSim * weights.address

  // Determine matching fields
  const matchingFields: string[] = []
  if (nameSim > 85) matchingFields.push('name')
  if (phoneticSim) matchingFields.push('phonetic_name')
  if (dobSim === 100) matchingFields.push('date_of_birth')
  if (idSim > 90) matchingFields.push('national_id')
  if (addrSim > 70) matchingFields.push('address')

  return {
    overallScore: Math.round(score),
    nameSimilarity: Math.round(nameSim),
    namePhonetic: phoneticSim,
    dobSimilarity: Math.round(dobSim),
    nationalIdSimilarity: Math.round(idSim),
    addressSimilarity: Math.round(addrSim),
    matchingFields
  }
}

/**
 * Determine if two records should be flagged as potential duplicates
 */
export function isPotentialDuplicate(similarity: SimilarityResult, threshold: number = 75): boolean {
  return similarity.overallScore >= threshold
}

/**
 * Get duplicate risk level based on similarity score
 */
export function getDuplicateRiskLevel(score: number): {
  level: 'low' | 'medium' | 'high' | 'critical'
  label: string
  color: string
} {
  if (score >= 95) {
    return { level: 'critical', label: 'Almost Certain', color: 'red' }
  } else if (score >= 85) {
    return { level: 'high', label: 'Very Likely', color: 'orange' }
  } else if (score >= 75) {
    return { level: 'medium', label: 'Possible', color: 'yellow' }
  } else {
    return { level: 'low', label: 'Unlikely', color: 'gray' }
  }
}
