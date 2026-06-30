import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets in AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Prioritize endpoint: analyzes deadlines and tasks to order them and generate emergency sub-steps
app.post("/api/ai/prioritize", async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks array is required" });
    }

    // Attempt Gemini call
    try {
      const ai = getAI();
      const prompt = `
        You are 'The Last-Minute Life Saver' AI companion. Your goal is to analyze a list of user tasks/deadlines and output a prioritized list with calculated 'threat levels' (from 1-100), urgency analysis, and concrete 'Life-Saving Micro-Steps' (extremely specific, bite-sized, autonomous execution plan steps) for the top 3 most urgent tasks.
        
        The user tasks are:
        ${JSON.stringify(tasks, null, 2)}

        Return a strictly formatted JSON object that matches the following schema:
        {
          "prioritizedTasks": [
            {
              "id": "original task id",
              "threatLevel": 85, // 1 to 100
              "urgencyExplanation": "Short description of why this is extremely urgent",
              "lifeSavingSteps": ["First micro-step...", "Second micro-step...", "Third micro-step..."] // 3-4 ultra-concrete actions
            }
          ],
          "generalSurvivalTip": "A highly motivating, vintage retro sci-fi-themed survival tip for the overall timeline."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prioritizedTasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    threatLevel: { type: Type.INTEGER },
                    urgencyExplanation: { type: Type.STRING },
                    lifeSavingSteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["id", "threatLevel", "urgencyExplanation", "lifeSavingSteps"]
                }
              },
              generalSurvivalTip: { type: Type.STRING }
            },
            required: ["prioritizedTasks", "generalSurvivalTip"]
          }
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText);
      res.json(result);
    } catch (apiError: any) {
      console.log("Using local rules-based prioritize generator fallback.");
      // Fallback response if GEMINI_API_KEY is not set or errors
      const prioritizedTasks = tasks.map((t: any, index: number) => {
        const dueDate = new Date(t.deadline || Date.now() + 86400000);
        const hoursLeft = Math.max(0, (dueDate.getTime() - Date.now()) / (1000 * 60 * 60));
        let baseThreat = 50;
        if (hoursLeft < 3) baseThreat = 95;
        else if (hoursLeft < 12) baseThreat = 85;
        else if (hoursLeft < 24) baseThreat = 70;
        else if (hoursLeft < 72) baseThreat = 45;

        if (t.priority === "high") baseThreat = Math.min(100, baseThreat + 15);
        if (t.completed) baseThreat = 0;

        return {
          id: t.id,
          threatLevel: Math.round(baseThreat),
          urgencyExplanation: hoursLeft <= 0 
            ? "Deadline has already passed! Immediate recovery required." 
            : `Only ${hoursLeft.toFixed(1)} hours left before expiration. Target critical path.`,
          lifeSavingSteps: [
            `Mute notifications and start pomodoro timer for 20 minutes to outline ${t.title}.`,
            `Prepare core materials needed (files, notes, links) and put them in one place.`,
            `Complete the absolute minimum viable draft or action to clear the roadblock.`
          ]
        };
      });

      res.json({
        prioritizedTasks,
        generalSurvivalTip: "Mute your phone, open one browser tab, and commit to 10 minutes of continuous focus right now. Speed beats perfection!",
        isLocalFallback: true,
        fallbackMessage: apiError.message
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Recommendation endpoint: based on user vibe, energy, stress, and remaining tasks, gives action plan
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { tasks, stressLevel, userVibe, hoursRemaining } = req.body;

    try {
      const ai = getAI();
      const prompt = `
        You are 'The Last-Minute Life Saver' productivity companion. Generate an urgent personalized productivity recipe for a user under the following conditions:
        - Current stress level: ${stressLevel} (e.g. Panic, Moderate, Cool)
        - Current vibe / Energy state: ${userVibe} (e.g. Sluggish, Wired, Hyper-focused, Exhausted)
        - Active incomplete tasks: ${JSON.stringify(tasks.filter((t: any) => !t.completed))}
        - Time left in session: ${hoursRemaining} hours

        Provide a highly action-oriented plan in a vintage retro CRT space-themed style. We want to save their deadline!
        Return a strictly formatted JSON object matching this schema:
        {
          "strategyName": "The Ultra-Sprint Protocol", 
          "headline": "A captivating, stylish, sci-fi-themed battle-plan command.",
          "sprintRoutine": [
            { "time": "00:00 - 00:15", "activity": "Quick win: Clear the lowest hanging fruit task to build momentum." },
            { "time": "00:15 - 00:45", "activity": "Deep dive: Turn on survival mode, mute alerts, and draft task 1." }
          ],
          "emergencyEmailTemplate": "Dear Team, I am finalising my submission and wanted to flag...", // in case they need a backup delay-negotiation template
          "encouragementPhrase": "You possess the cognitive capacity to overcome this backlog. Engage thrusters."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategyName: { type: Type.STRING },
              headline: { type: Type.STRING },
              sprintRoutine: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING }
                  },
                  required: ["time", "activity"]
                }
              },
              emergencyEmailTemplate: { type: Type.STRING },
              encouragementPhrase: { type: Type.STRING }
            },
            required: ["strategyName", "headline", "sprintRoutine", "emergencyEmailTemplate", "encouragementPhrase"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (apiError: any) {
      console.log("Using local premium recommendation generator fallback.");
      
      const strategies: Record<string, any> = {
        Panic: {
          strategyName: "Emergency Defcon 1 Protocol",
          headline: "CALM INDUCED SPRINT FOR MAX OUTPUT",
          sprintRoutine: [
            { time: "Min 1-5", activity: "Absolute silence. Close all other tabs. Take 3 deep breaths." },
            { time: "Min 5-25", activity: "Write a bulleted skeleton draft. Do NOT edit, just output raw information." },
            { time: "Min 25-30", activity: "Submit minimum viable work or request a 3-hour strategic extension." }
          ],
          emergencyEmailTemplate: "Hi team, I am putting the finishing touches on the deliverables. To ensure the highest standard, I'll send the absolute file over shortly. Thank you for your flexibility!",
          encouragementPhrase: "Breathe. Panic is just energy without a vector. Channel it into pure creation."
        },
        Exhausted: {
          strategyName: "The Slow-Burn Completion Strategy",
          headline: "LOW ENERGY SKELETON COMPOSITION",
          sprintRoutine: [
            { time: "Min 1-10", activity: "Brain-dump all raw thoughts for the task without format rules." },
            { time: "Min 10-25", activity: "Use templates/existing files to copy structure. Work in 15 minute bursts." },
            { time: "Min 25-35", activity: "Review and hand off the first draft. Done is better than perfect!" }
          ],
          emergencyEmailTemplate: "Hello, I am routing the task updates through. I will have the final review submitted within the hour. Best, [Your Name]",
          encouragementPhrase: "Even slow progress is an escape velocity. Brick by brick, clear the line."
        }
      };

      const matched = strategies[stressLevel] || strategies[userVibe] || {
        strategyName: "The Last-Minute Rescue Plan",
        headline: "CRITICAL PATH VELOCITY ENGAGED",
        sprintRoutine: [
          { time: "Step 1 (15m)", activity: "Mute your phone, put on lofi/synthwave, and perform a mini sprint." },
          { time: "Step 2 (30m)", activity: "Tackle the most complex portion of your nearest deadline task." },
          { time: "Step 3 (5m)", activity: "Quick visual check and lock-in completion." }
        ],
        emergencyEmailTemplate: "Hi, I'm working diligently on this. I am finishing the final stages and will present it shortly. Apologies for any delay!",
        encouragementPhrase: "You are the commander. Direct your action to the closest target, and fire."
      };

      res.json({
        ...matched,
        isLocalFallback: true,
        fallbackMessage: apiError.message
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Auto-Plan from Notes: scans the contents of user notes, extracts todo list tasks with priorities and deadlines, and returns them
app.post("/api/ai/auto-plan", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || !Array.isArray(notes)) {
      return res.status(400).json({ error: "Notes array is required" });
    }

    try {
      const ai = getAI();
      const prompt = `
        You are an elite productivity AI agent. Your task is to read the user's active notes and extract highly actionable, concrete tasks that should be scheduled on their calendar.
        
        The user notes are:
        ${JSON.stringify(notes, null, 2)}

        For any note that mentions a task, an assignment, shopping, chores, meeting, draft, or checklist, extract a corresponding calendar task.
        Assign a realistic due date in "YYYY-MM-DD" format (assume today is 2026-06-29, schedule tasks between 2026-06-29 and 2026-07-05).
        Assign a priority: "high", "medium", or "low".
        
        Return a strictly formatted JSON response containing the list of new tasks:
        {
          "plannedTasks": [
            {
              "title": "Clear concise task title",
              "description": "Short explanation of the task derived from the note context.",
              "priority": "high" | "medium" | "low",
              "dueDate": "YYYY-MM-DD",
              "derivedFromNoteId": "id of the note it came from"
            }
          ],
          "planningSummary": "A quick motivational summary of what the AI automatically extracted and scheduled."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plannedTasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    dueDate: { type: Type.STRING },
                    derivedFromNoteId: { type: Type.STRING }
                  },
                  required: ["title", "description", "priority", "dueDate"]
                }
              },
              planningSummary: { type: Type.STRING }
            },
            required: ["plannedTasks", "planningSummary"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (apiError: any) {
      console.log("Using local auto-plan keyword extraction fallback.");
      // Fallback: search notes for keywords and extract simple tasks
      const plannedTasks: any[] = [];
      notes.forEach((note: any) => {
        const titleLower = note.title.toLowerCase();
        const contentLower = note.content.toLowerCase();
        if (titleLower.includes("meeting") || contentLower.includes("discuss") || contentLower.includes("sprint")) {
          plannedTasks.push({
            title: `Follow up on: ${note.title}`,
            description: `Action item extracted from your meeting note details.`,
            priority: "high",
            dueDate: "2026-06-29",
            derivedFromNoteId: note.id
          });
        } else if (titleLower.includes("grocery") || contentLower.includes("buy") || contentLower.includes("shop")) {
          plannedTasks.push({
            title: `Pick up groceries / items`,
            description: `Derived from personal list: "${note.title}".`,
            priority: "medium",
            dueDate: "2026-06-30",
            derivedFromNoteId: note.id
          });
        } else if (note.content.length > 10) {
          plannedTasks.push({
            title: `Review & edit note: ${note.title}`,
            description: `Maintain high-quality drafting of your ideas.`,
            priority: "low",
            dueDate: "2026-07-01",
            derivedFromNoteId: note.id
          });
        }
      });

      res.json({
        plannedTasks,
        planningSummary: "Scanning notes... Extracted actionable tasks from matching keywords using local parser rules.",
        isLocalFallback: true
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Execute Task: simulates real background execution by generating multi-step agent logs and a beautiful work summary note (artifact)
app.post("/api/ai/execute-task", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required for automatic execution" });
    }

    try {
      const ai = getAI();
      const prompt = `
        You are 'The Auto-Executor Agent'. You have been authorized to automatically execute the following task:
        Title: "${task.title}"
        Description: "${task.description}"
        Priority: "${task.priority}"
        Due Date: "${task.dueDate}"

        Perform a highly realistic simulation of executing this task. Research, outline, compile, and produce the final product.
        
        Return a strictly formatted JSON response with the final log reports and a beautifully composed markdown outcome document (note content) that represents the final artifact of your automatic execution.
        
        The response must match this schema:
        {
          "logs": [
            { "time": "00:01", "type": "info" | "agent" | "success" | "warn", "message": "First execution step description..." },
            { "time": "00:04", "type": "info" | "agent" | "success" | "warn", "message": "Second execution step description..." },
            { "time": "00:08", "type": "info" | "agent" | "success" | "warn", "message": "Third execution step description..." },
            { "time": "00:12", "type": "info" | "agent" | "success" | "warn", "message": "Completion message..." }
          ],
          "completedArtifact": {
            "title": "Executed: [Task Title]",
            "content": "A beautifully drafted markdown document containing the complete output of the task (e.g. structured guidelines, shopping meal plans, outline draft, specs sheets etc. based on the task description). Ensure this is at least 3-4 paragraphs of highly valuable, professional content so the user receives real value!"
          }
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              logs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    type: { type: Type.STRING },
                    message: { type: Type.STRING }
                  },
                  required: ["time", "type", "message"]
                }
              },
              completedArtifact: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            required: ["logs", "completedArtifact"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (apiError: any) {
      console.log("Using local automatic task execution fallback.");
      // Fallback response with beautiful markdown content
      const logs = [
        { time: "00:01", type: "info", message: `Initializing automatic execution thread for task: "${task.title}".` },
        { time: "00:03", type: "agent", message: "Analyzing constraints and drafting minimum viable content skeleton." },
        { time: "00:06", type: "agent", message: "Structuring references, compiling outlines, and verifying checklist." },
        { time: "00:09", type: "success", message: "Final draft assembled, proofread, and published as a secure workspace document." }
      ];

      res.json({
        logs,
        completedArtifact: {
          title: `Executed: ${task.title}`,
          content: `### 🚀 Automated Execution Output: ${task.title}\n\nThis task was automatically processed and executed by the **BlissPlan Auto-Executor Agent**.\n\n#### 📊 Executive Summary\n- **Objective**: ${task.description || 'Complete action guidelines.'}\n- **Priority**: ${task.priority.toUpperCase()}\n- **Status**: SUCCESS\n\n#### 📝 Work Performed & Deliverables\n1. **Research & Synthesis**: Formulated core concepts and resolved potential blockers.\n2. **Draft Composition**: Wrote a pristine draft outlining key parameters.\n3. **Validation**: Verified and formatted final outcomes into local Workspace vaults.\n\n*This document is saved as a secure record of completed task execution. No further manual effort required.*`
        },
        isLocalFallback: true
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Voice Command Processing
app.post("/api/ai/voice-command", async (req, res) => {
  try {
    const { text, currentTasks } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Voice transcription text is required" });
    }

    try {
      const ai = getAI();
      const prompt = `
        You are 'The Last-Minute Life Saver' retro-futuristic AI vocal assistant.
        The user spoke the following command: "${text}"

        Analyze the spoken text and determine:
        1. Is the user trying to add a new task? (e.g. "remind me to finish slides by 5pm", "add task submit math homework tomorrow", "schedule study session")
        2. Is the user panicking/stressing? (e.g. "I'm going to fail", "I have so much to do", "help me", "I am super stressed")
        3. Is the user asking for a summary of their top task or workloads? (e.g. "what's my summary", "show me my tasks", "what's next on my plate")
        4. Is the user asking for personalized recommendations or schedule advice? (e.g. "give me advice", "suggest a routine", "how should I plan my day", "give recommendations", "optimize my schedule")
        5. Is the user trying to execute/run/automate a specific task? (e.g. "execute task Release BlissTime Beta", "run task check list", "complete task study")
        6. Is the user trying to clear all completed tasks? (e.g. "clear completed", "clear all completed tasks", "remove finished tasks", "wipe out completed list")
        7. Is the user trying to move a task to a specific folder? (e.g. "move task Release Lumora AI Beta to projects folder", "move task exercise to health", "put task submit math homework in work folder")

        Available folders are: 'work', 'personal', 'projects', 'ideas', 'inspiration', 'health'.

        Return a strictly formatted JSON response mapping what to do:
        {
          "spokenFeedback": "The vocal text that the browser will read back to the user in a stylish, retro voice, providing a specific verbal confirmation of the exact action taken.",
          "detectedAction": "ADD_TASK" | "PANIC_RELIEF" | "GET_SUMMARY" | "GET_RECOMMENDATIONS" | "EXECUTE_TASK" | "CLEAR_COMPLETED_TASKS" | "MOVE_TASK_TO_FOLDER" | "NONE",
          "parsedTask": { 
            "title": "Cleaned title of the task",
            "deadlineOffsetHours": 4, // estimate hours from now when they want it, or 24 if tomorrow, or 2 if "by 5pm" etc
            "priority": "high" | "medium" | "low"
          },
          "targetFolderId": "work" | "personal" | "projects" | "ideas" | "inspiration" | "health"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              spokenFeedback: { type: Type.STRING },
              detectedAction: { type: Type.STRING },
              parsedTask: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  deadlineOffsetHours: { type: Type.INTEGER },
                  priority: { type: Type.STRING }
                }
              },
              targetFolderId: { type: Type.STRING }
            },
            required: ["spokenFeedback", "detectedAction"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (apiError: any) {
      console.log("Using local voice assistant processing fallback.");
      
      let spokenFeedback = "Command received. Processing with fallback logic. How else can I assist your critical path?";
      let detectedAction = "NONE";
      let parsedTask: any = null;
      let targetFolderId: string | undefined = undefined;

      const lowerText = text.toLowerCase();
      if (lowerText.includes("clear") && (lowerText.includes("completed") || lowerText.includes("finished") || lowerText.includes("done"))) {
        detectedAction = "CLEAR_COMPLETED_TASKS";
        spokenFeedback = "Acknowledged. Clearing all completed items from your timeline to optimize your workflow.";
      } else if (lowerText.includes("move") && (lowerText.includes("to") || lowerText.includes("folder"))) {
        detectedAction = "MOVE_TASK_TO_FOLDER";
        let folderId = "work";
        if (lowerText.includes("personal")) folderId = "personal";
        else if (lowerText.includes("project")) folderId = "projects";
        else if (lowerText.includes("idea")) folderId = "ideas";
        else if (lowerText.includes("inspiration")) folderId = "inspiration";
        else if (lowerText.includes("health")) folderId = "health";

        let taskTitle = text.replace(/move task|move|to projects folder|to personal folder|to ideas folder|to inspiration folder|to health folder|to work folder|to projects|to personal|to ideas|to inspiration|to health|to work|in /gi, "").trim();
        parsedTask = { title: taskTitle || "New Task" };
        spokenFeedback = `Understood. Moving task '${parsedTask.title}' to the ${folderId} folder.`;
        targetFolderId = folderId;
      } else if (lowerText.includes("add") || lowerText.includes("remind") || lowerText.includes("task") || lowerText.includes("need to") || lowerText.includes("schedule")) {
        detectedAction = "ADD_TASK";
        let title = text.replace(/remind me to|add task|i need to|schedule/gi, "").trim();
        if (title.length > 50) title = title.substring(0, 50) + "...";
        parsedTask = {
          title: title || "New Spoken Task",
          deadlineOffsetHours: lowerText.includes("tomorrow") ? 24 : lowerText.includes("tonight") ? 8 : 4,
          priority: "high"
        };
        spokenFeedback = `Understood. Emergency protocol activated. I have logged '${parsedTask.title}' as a high threat level item expiring soon. Get ready to sprint.`;
      } else if (lowerText.includes("panic") || lowerText.includes("scared") || lowerText.includes("fail") || lowerText.includes("stress") || lowerText.includes("help") || lowerText.includes("overwhelmed")) {
        detectedAction = "PANIC_RELIEF";
        spokenFeedback = "Warning: Stress levels elevated. Initializing neural-calm protocol. Close your eyes, exhale for four seconds, and remember that action dissolves anxiety. You are fully capable of resolving this timeline.";
      } else if (lowerText.includes("recommend") || lowerText.includes("advice") || lowerText.includes("plan my day") || lowerText.includes("suggest") || lowerText.includes("optimize")) {
        detectedAction = "GET_RECOMMENDATIONS";
        spokenFeedback = "I have scanned your current stress and workloads. Launching your personalized productivity routine and recommendations right now.";
      } else if (lowerText.includes("execute") || lowerText.includes("run") || lowerText.includes("complete")) {
        detectedAction = "EXECUTE_TASK";
        let title = text.replace(/execute task|execute|run task|run|complete task|complete/gi, "").trim();
        parsedTask = {
          title: title || "New Task",
          deadlineOffsetHours: 4,
          priority: "high"
        };
        spokenFeedback = `Understood. Activating autonomous executor agent for task: '${parsedTask.title}'. Please review the compiled outcome report once completed.`;
      } else {
        detectedAction = "GET_SUMMARY";
        spokenFeedback = "Scanning active databank. You have several pending deadlines. Select a task to activate Life-Saver micro-sprints immediately.";
      }

      res.json({
        spokenFeedback,
        detectedAction,
        parsedTask,
        targetFolderId,
        isLocalFallback: true
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Habit & Goal Trajectory & Cognitive Addition Prediction
app.post("/api/ai/trajectory-prediction", async (req, res) => {
  try {
    const { habits, goals } = req.body;
    
    try {
      const ai = getAI();
      const prompt = `
        You are 'Lumora Trajectory & Cognitive Addition Engine'.
        The user has configured the following habits and goals:
        Habits:
        ${JSON.stringify(habits, null, 2)}
        
        Goals:
        ${JSON.stringify(goals, null, 2)}

        We need to predict where these habits and goals will lead the user and how they will add to their skills, education, and knowledge bank.
        Specifically, identify:
        1. "oneMonthOutlook": A inspiring 1-month trajectory projection of their state.
        2. "threeMonthOutlook": A detailed 3-month projection.
        3. "oneYearOutlook": A long-term 1-year mastery projection of these repeated disciplines.
        4. "skillsGained": A list of up to 4 real-world skills or disciplines being actively developed.
        5. "cognitiveRoiExplanation": A concise summary of how these specific habits and goals add up to personal education, cognitive enrichment, and life enhancement.
        6. "academicDomain": A creative, premium, human-styled academic or professional domain describing their aggregate focus (e.g., 'Autonomous Software Engineering & Cognitive Resilience' or 'Data Architecture & Stress Bio-Optimization').
        7. "learningOpportunities": A list of 3 specific, highly valuable things/concepts they should study or books they should read to support this growth path.

        Return a strictly formatted JSON response.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              oneMonthOutlook: { type: Type.STRING },
              threeMonthOutlook: { type: Type.STRING },
              oneYearOutlook: { type: Type.STRING },
              skillsGained: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cognitiveRoiExplanation: { type: Type.STRING },
              academicDomain: { type: Type.STRING },
              learningOpportunities: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              "oneMonthOutlook",
              "threeMonthOutlook",
              "oneYearOutlook",
              "skillsGained",
              "cognitiveRoiExplanation",
              "academicDomain",
              "learningOpportunities"
            ]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (apiError: any) {
      console.log("Using local voice assistant processing fallback.");
      
      // Local fallback logic
      const hText = habits ? habits.map((h: any) => h.title).join(" ").toLowerCase() : "";
      const gText = goals ? goals.map((g: any) => g.title + " " + g.description).join(" ").toLowerCase() : "";
      const combined = hText + " " + gText;

      let academicDomain = "Holistic Lifelong Learning & Cognitive Progression";
      let skillsGained = ["Executive Functioning", "Self-Discipline", "Routine Formulation", "Core Resilience"];
      let learningOpportunities = [
        "Read 'Atomic Habits' by James Clear to master behavioral science.",
        "Practice daily time-boxing intervals to prevent stress fatigue.",
        "Study core cognitive frameworks to map out learning priorities."
      ];
      let cognitiveRoiExplanation = "Your selected disciplines build high-leverage cognitive focus, establishing a solid baseline for skill acquisition and mental clarity.";
      let oneMonthOutlook = "You will establish automatic behavior loops, reducing the cognitive friction of starting hard tasks by up to 40%.";
      let threeMonthOutlook = "Compound gains from your habits will translate to noticeable project milestones, creating positive psychological feedback loops.";
      let oneYearOutlook = "Your consistent routines will cement these behaviors as core identity traits, graduating you into high-leverage professional mastery.";

      if (combined.includes("dbms") || combined.includes("database") || combined.includes("sql")) {
        academicDomain = "Systems Architecture & Data Management Science";
        skillsGained = ["Relational Data Modeling", "SQL Query Design", "Data System Schemas", "Transaction Lifecycle"];
        learningOpportunities = [
          "Read 'Designing Data-Intensive Applications' by Martin Kleppmann.",
          "Study the inner workings of B-Trees, transactions, and indexing strategies.",
          "Design a mock multi-node database schema to practice replication patterns."
        ];
        cognitiveRoiExplanation = "By studying DBMS, you are moving from high-level developer to an architect of resilient data storage systems, vastly increasing your engineering value.";
        oneMonthOutlook = "You will master schema constraints and database triggers, allowing you to confidently build data-safe backend systems.";
        threeMonthOutlook = "You will understand transactional isolation levels (ACID) and write optimal queries that handle high concurrent workloads without deadlocks.";
        oneYearOutlook = "You will have a deep, intuitive mastery of database indexing and storage mechanics, preparing you for senior systems architect responsibilities.";
      } else if (combined.includes("react") || combined.includes("frontend") || combined.includes("web") || combined.includes("ui") || combined.includes("js") || combined.includes("typescript")) {
        academicDomain = "Interactive Client-Side Engineering & Human-Interface Design";
        skillsGained = ["Component Composition", "State Synchronicities", "Interactive UI Frameworks", "UX Visual Hierarchy"];
        learningOpportunities = [
          "Study React Fiber reconciler architecture and state rendering loops.",
          "Examine Tailwind CSS best practices for responsive, fluid typography.",
          "Read 'Don't Make Me Think' by Steve Krug to master intuitive web usability."
        ];
        cognitiveRoiExplanation = "Developing frontend expertise trains your mind to balance rigid technological state systems with intuitive, fluid human workflows and design aesthetics.";
        oneMonthOutlook = "You will eliminate infinite re-renders and master custom React hooks to isolate complex stateful logic cleanly.";
        threeMonthOutlook = "You will design complete, accessible, responsive applications with fluid page transitions using motion mechanics.";
        oneYearOutlook = "You will design full UI libraries, master build pipelines (Vite/Webpack), and orchestrate complex client-side applications.";
      } else if (combined.includes("hydration") || combined.includes("water") || combined.includes("exercise") || combined.includes("walk") || combined.includes("sleep") || combined.includes("health")) {
        academicDomain = "Physiological Optimization & Bio-Cognitive Resilience";
        skillsGained = ["Homeostatic Regulation", "Circadian Synchronization", "Energy Management", "Stress-reduction loops"];
        learningOpportunities = [
          "Study biological energy cycles (ATP production) and cell hydration chemistry.",
          "Explore 'Why We Sleep' by Matthew Walker to master sleep-cognitive recovery.",
          "Implement structured mobility exercises to support physical neural-resilience."
        ];
        cognitiveRoiExplanation = "By prioritizing biological homeostasis (hydration, movement, recovery), you supply your brain with optimal chemical conditions for rapid learning and deep focus.";
        oneMonthOutlook = "Consistent hydration and micro-breaks will eliminate midday cognitive dips and increase your active daily focus by 90 minutes.";
        threeMonthOutlook = "Restorative physiological routines will lower baseline cortisol, improving your high-stress decision-making capabilities.";
        oneYearOutlook = "A highly optimized bio-cognitive engine will sustain top-tier cognitive output year-round, preventing mental burnout entirely.";
      }

      res.json({
        oneMonthOutlook,
        threeMonthOutlook,
        oneYearOutlook,
        skillsGained,
        cognitiveRoiExplanation,
        academicDomain,
        learningOpportunities,
        isLocalFallback: true
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE AND STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
