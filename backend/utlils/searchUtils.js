export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  
    .split(/\s+/)            
    .filter(word => word.length >2);         
}

export function jaccardSimilarity(arrA, arrB) {
  const setA = new Set(arrA);
  const setB = new Set(arrB);
  
  const intersection = [...setA].filter(x => setB.has(x));
  const union = new Set([...setA, ...setB]);

  return intersection.length / union.size;
}

export function generateTags(title, description) {
  const stopWords = new Set([
  "the", "is", "at", "which", "on", "in", "and", "a", "an", "to", "of", "with", "for", "as",
  "by", "from", "that", "it", "this", "are", "has", "were", "was", "have", "had", "all", "there",
  "their", "be", "one", "its", "also", "but", "or", "into", "out", "about", "other", "they",
  "them", "can", "will", "would", "been", "some", "than", "many", "more", "such", "very", "not"
]);

  const safeTitle = title || '';
  const safeDescription = description || '';
  const combinedText = `${safeTitle} ${safeDescription}`.toLowerCase();
  const tokens = tokenize(combinedText);

  // Filter out stopwords, undefined, and duplicates
  const tags = tokens.filter(token => token && token !== 'undefined' && !stopWords.has(token));
  
  // Unique tags
  return [...new Set(tags)];
}

const synonyms = {
  // Heritage and religious sites
  heritage: ["historic", "monument", "cultural", "ancient", "traditional", "site", "place"],
  temple: ["shrine", "mandir", "gumba", "monastery", "pagoda", "religious", "sacred", "holy"],
  stupa: ["chaitya", "buddhist", "shrine", "pagoda"],
  durbar: ["palace", "square", "royal", "court", "heritage", "historic"],
  
  // Religious and spiritual terms
  religious: ["spiritual", "sacred", "holy", "divine", "worship", "prayer"],
  buddhist: ["buddha", "dharma", "meditation", "monastery", "monk"],
  hindu: ["hinduism", "deity", "god", "goddess", "puja", "ritual"],
  
  // Peace and tranquility
  peace: ["peaceful", "tranquil", "serene", "calm", "quiet", "meditation", "spiritual"],
  meditation: ["mindfulness", "peace", "tranquil", "spiritual", "calm"],
  
  // Location and architecture
  square: ["plaza", "courtyard", "area", "space", "durbar"],
  palace: ["durbar", "castle", "royal", "court"],
  museum: ["gallery", "exhibition", "collection", "artifacts"],
  view: ["scenic", "sight", "panoramic", "vista", "landscape"],
  market: ["bazaar", "shop", "mall", "trading"],
  
  // Specific heritage sites keywords
  pashupatinath: ["shiva", "hindu", "temple", "bagmati", "cremation", "sacred", "religious"],
  boudhanath: ["buddhist", "stupa", "tibetan", "monastery", "prayer", "peace", "peaceful", "religious"],
  swayambhunath: ["monkey", "temple", "buddhist", "stupa", "hill", "kathmandu", "peace", "religious"],
  kathmandu: ["capital", "valley", "durbar", "square", "heritage"],
  patan: ["lalitpur", "durbar", "square", "newari", "architecture"],
  bhaktapur: ["durbar", "square", "medieval", "pottery", "newari"],
  changunarayan: ["vishnu", "temple", "ancient", "hill", "heritage"]
};

function expandTokensWithSynonyms(tokens) {
  let expanded = [...tokens];
  tokens.forEach(token => {
    if (synonyms[token]) {
      expanded.push(...synonyms[token]);
    }
  });
  return [...new Set(expanded)];
}

// Category mappings for broad search terms
const categoryMappings = {
  "heritage site": ["durbar", "palace", "historic", "cultural", "architecture", "ancient"],
  "religious site": ["temple", "stupa", "monastery", "shrine", "sacred", "holy", "boudhanath", "pashupatinath", "swayambhunath"],
  "religious": ["temple", "stupa", "monastery", "shrine", "sacred", "holy", "boudhanath", "pashupatinath", "swayambhunath"],
  "temple": ["pashupatinath", "changunarayan", "swayambhunath", "mandir", "shrine"],
  "stupa": ["boudhanath", "swayambhunath", "buddhist", "chaitya"],
  "durbar square": ["kathmandu durbar", "patan durbar", "bhaktapur durbar", "durbar", "square"],
  "peace": ["boudhanath", "swayambhunath", "buddhist", "meditation", "monastery", "tranquil", "peaceful"],
  "peaceful": ["boudhanath", "swayambhunath", "buddhist", "meditation", "monastery", "tranquil", "peace"],
  "buddhist": ["boudhanath", "swayambhunath", "monastery", "stupa"],
  "hindu": ["pashupatinath", "changunarayan", "temple", "deity"]
};

function expandWithCategories(query) {
  const lowerQuery = query.toLowerCase().trim();
  let expandedTerms = [query];
  
  // Check for exact category matches
  Object.keys(categoryMappings).forEach(category => {
    if (lowerQuery === category || lowerQuery.includes(category)) {
      expandedTerms.push(...categoryMappings[category]);
    }
  });
  
  return [...new Set(expandedTerms)];
}

export function semanticSearchScore(query, content) {
  // First expand query with category mappings
  const expandedQueries = expandWithCategories(query);
  const allQueryTokens = expandedQueries.flatMap(q => expandTokensWithSynonyms(tokenize(q)));
  const contentTokens = expandTokensWithSynonyms(tokenize(content));
  
  return jaccardSimilarity([...new Set(allQueryTokens)], contentTokens);
}

