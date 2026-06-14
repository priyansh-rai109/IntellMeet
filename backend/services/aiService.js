const OpenAI = require('openai')

// Lazily instantiated so the app doesn't crash if the key is missing at startup
let _openai = null

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on this server.')
  }
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

/**
 * Generates a concise bullet-point summary from a meeting transcript.
 * @param {string} transcript
 * @returns {Promise<string>}
 */
async function generateSummary(transcript) {
  const openai = getClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert meeting assistant. Summarize the meeting transcript in 4-5 concise bullet points covering key decisions, outcomes, and important discussions. Each bullet point should start with "• ".',
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  })

  return response.choices[0].message.content
}

/**
 * Extracts structured action items from a meeting transcript.
 * Returns a JSON array of { task, assignee, deadline, priority }.
 * @param {string} transcript
 * @returns {Promise<Array>}
 */
async function extractActionItems(transcript) {
  const openai = getClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Extract all action items from this meeting transcript.
For each action item return a JSON object with exactly these fields:
- task: string (the action to be done)
- assignee: string (the person responsible, or "Unassigned" if not mentioned)
- deadline: string (due date if mentioned, or "Not specified")
- priority: string (must be exactly "high", "medium", or "low" based on urgency)

Return ONLY a valid JSON array. No markdown, no code fences, no explanation.
Example: [{"task":"Send report","assignee":"John","deadline":"Friday","priority":"high"}]`,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    temperature: 0.2,
    max_tokens: 800,
  })

  let content = response.choices[0].message.content.trim()
  // Strip any accidental markdown fences
  content = content.replace(/```json|```/g, '').trim()

  return JSON.parse(content)
}

module.exports = { generateSummary, extractActionItems }
