package com.fitness.aiService.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiService.model.Activity;
import com.fitness.aiService.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    // Used to generate recommendation when any perticular activity is updated. It listens to the activity from rabbitmq
    public String generateRecommendation(Activity activity){
        String prompt = createPrompt(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {} ", aiResponse);
        processAIResponse(activity,aiResponse);
        return aiResponse;
    }

    // Gets the AI response and removes the unwanted part like ``` \\n
    private void processAIResponse(Activity activity, String aiResponse){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");
            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();
            // log.info("PARSED RESPONSE FROM AI: {}", jsonContent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //Used to create a prompt to send via API along with activity info
    private String createPrompt(Activity activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations for improvising in the following EXACT JSON format:
                {
                    "analysis" : {
                      "overall" : "Overall analysis here",
                      "pace" : "Pace analysis here",
                      "heartRate" : "Heart rate analysis here",
                      "caloriesBurned" : "Calories analysis here"
                    },
                    "improvements" : [
                      {
                        "area" : "Area name",
                        "recommendation" : "Detailed recommendation"
                      }
                    ],
                    "suggestions": [
                       {
                       "workout" : "Workout name",
                       "description" : "Detailed workout description"
                       }
                    ],
                    "safety" : [
                       "Safety point 1",
                       "Safety point 2"
                    ]
                }
                Analyze this activity:
                Activity type: %s
                Duration: %d minutes
                Calories burned: %d
                Additional Metrics: %s
                Provide detailed analysis focusing on performance, improvements, next workout suggestions and safety guidelines
                Ensure the response follows the EXACT JSON format shown above.
                """,
                    activity.getType(),
                    activity.getDuration(),
                    activity.getCaloriesBurned(),
                    activity.getAdditionalMetrics()
                );

    }

}
