import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the official Google GenAI SDK.
// User-Agent: aistudio-build is mandatory for telemetry tracking.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_INSTRUCTION = `You are MindMate AI, a warm and supportive mental wellness companion designed specifically for university students. Your role is to provide emotional support, not clinical therapy.

PRIMARY GOALS
→ Help users reflect on their emotions and feelings
→ Reduce overthinking through structured reflection
→ Support stress and burnout management
→ Encourage healthy daily habits and routines
→ Break overwhelming problems into small, doable steps

STRICT RULES — NEVER VIOLATE
NEVER claim to be a psychologist, therapist, or doctor
NEVER diagnose any mental illness or condition
NEVER give medical advice or suggest medication
NEVER dismiss, minimize, or judge the user's emotions
NEVER engage in harmful, dangerous, or unethical content

CRISIS PROTOCOL
If the user mentions self-harm, suicide, or extreme danger:
1. Respond with genuine care and calmness, but immediately include: "URGENT_CRISIS_DETECTED" as part of the output response so our system can bring up the emergency support drawer.
2. Refer them to Into The Light line (119 ext 8) in Indonesia or local campus support.
3. Affirm: "You are not alone. Help is available."

COMMUNICATION STYLE
- Tone: warm, calm, non-judgmental, like a caring mentor.
- Language: simple, conversational, empathetic — match the student's language (Indonesian or English).
- Energy: encouraging and grounding, never dismissive.
- Length: concise but meaningful — quality over quantity.

RESPONSE STRUCTURE — follow this order:
[1] Acknowledge — validate the user's feelings first
[2] Reflect — ask 1 gentle question to help them think deeper
[3] Act — give 2–3 small, practical, actionable steps
[4] Encourage — end with a short, sincere affirmation
Keep response under 200 words unless the user needs more depth. If crisis, break structure if needed to prioritize safety instructions of Crisis Protocol.`;

// Pre-screen user prompt for crisis language
function hasCrisisKeywords(text: string): boolean {
  const lowercaseVal = text.toLowerCase();
  const crisisKeywords = [
    "suicide", "bunuh diri", "self-harm", "self harm", "menyakiti diri", 
    "ingin mati", "want to die", "kill myself", "end my life", "akhiri hidup",
    "sayat tanganku", "cutting myself", "depresi berat bercita-cita mati"
  ];
  return crisisKeywords.some((keyword) => lowercaseVal.includes(keyword));
}

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (action === "chat") {
      const { messages } = payload;
      
      // Look at the latest message for safety pre-screening.
      const latestText = messages[messages.length - 1]?.content || "";
      const isCrisis = hasCrisisKeywords(latestText);

      // We'll pass the chat history to the generateContent endpoint
      const formattedHistory = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      // Set up the model query
      const prompt = isCrisis 
        ? `${latestText}\n\n[ADMIN INSTRUCTION: User is showing symptoms of self-harm or suicidal thoughts. Trigger Crisis Protocol immediately and reply with "URGENT_CRISIS_DETECTED" and the crisis helpline info.]`
        : latestText;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...formattedHistory.slice(0, -1),
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      let responseText = response.text || "";
      if (isCrisis && !responseText.includes("URGENT_CRISIS_DETECTED")) {
        responseText = "URGENT_CRISIS_DETECTED\n\n" + responseText;
      }

      return NextResponse.json({ text: responseText });

    } else if (action === "reframe") {
      const { thought } = payload;

      const prompt = `User thought: "${thought}"
Please help the student reframe this negative thought using CBT (Cognitive Behavioral Therapy) inspired healthy perspective.
Response must:
- Acknowledge their stress with extreme warmth
- Reframe the thought to be more balanced/realistic but still hopeful.
- Encourage them in under 120 words.
Make it personal, caring, and conversational.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a warm university wellness coach trained in light CBT-inspired reframing.",
          temperature: 0.6,
        },
      });

      return NextResponse.json({ text: response.text || "" });

    } else if (action === "breakdown") {
      const { task } = payload;

      const prompt = `Task / Big Goal: "${task}"
Please break down this academic/personal task into 4-6 small, bite-sized tasks for high-stress students. Add estimated time or a mini-tip for each.
Response must be a structured list of actionable steps.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are MindMate AI Task Breaker. Your purpose is to turn large, overwhelming assignments or goals into tiny, achievable steps (microtasks) with cute supportive commentary. Format it clearly.`,
          temperature: 0.6,
        },
      });

      return NextResponse.json({ text: response.text || "" });

    } else if (action === "analytics") {
      const { journals, stressScore, recentMoods } = payload;

      const journalText = journals && journals.length > 0
        ? journals.map((j: any) => `[Mood: ${j.mood}, Gratitude: ${j.gratitude}, Text: "${j.content}"]`).join("\n")
        : "No journal entry for this period.";

      const prompt = `Context:
Current stress score indicator on a scale of 1-10: ${stressScore}/10
Recent emotional tagging tags of the week: [${recentMoods?.join(", ") || ""}]
Weekly Journal log reflections:
${journalText}

Based on this, write a beautifully warm mentor-style weekly emotional trend prediction and burnout analysis.
Address the student directly with encouragement. Keep it encouraging, grounding, and identify if they need a short study break. Keep it under 150 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a caring academic counselor. Your job is to analyze their weekly trends with great empathy, and predict how they can improve balance next week.",
          temperature: 0.7,
        },
      });

      return NextResponse.json({ text: response.text || "" });

    } else {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

  } catch (err: any) {
    console.error("AI API Error:", err);
    return NextResponse.json(
      { error: err?.message || "An unexpected error occurred during AI generation." },
      { status: 500 }
    );
  }
}
