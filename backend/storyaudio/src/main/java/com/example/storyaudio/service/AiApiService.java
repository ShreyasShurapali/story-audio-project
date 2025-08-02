package com.example.storyaudio.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AiApiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${tts.api.key}")
    private String ttsApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String generateStory(String prompt) throws IOException, InterruptedException {
        // This method is working correctly. No changes needed here.
        System.out.println("Calling Google Gemini API for story generation...");
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + geminiApiKey;
        String jsonPayload = new JSONObject()
                .put("contents", new JSONObject[]{
                        new JSONObject()
                                .put("parts", new JSONObject[]{
                                new JSONObject()
                                        .put("text", "Write a short, fun, and imaginative story based on this prompt: " + prompt)
                        })
                })
                .toString();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JSONObject jsonResponse = new JSONObject(response.body());
            return jsonResponse.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
        } else {
            System.err.println("Error from Gemini API: " + response.body());
            return "The AI story generator failed. Backup story for: '" + prompt + "'.";
        }
    }

    public byte[] generateAudio(String text) throws IOException, InterruptedException {
        System.out.println("Calling Murf.ai API (Step 1: Generate audio link)...");
        String apiUrl = "https://api.murf.ai/v1/speech/generate";

        String jsonPayload = new JSONObject()
                .put("text", text)
                .put("voiceId", "en-US-natalie")
                .toString();

        HttpRequest generateRequest = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("api-key", ttsApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> generateResponse = httpClient.send(generateRequest, HttpResponse.BodyHandlers.ofString());

        System.out.println("DEBUG: Murf.ai JSON Response Body: " + generateResponse.body());

        if (generateResponse.statusCode() == 200) {
            JSONObject jsonResponse = new JSONObject(generateResponse.body());

            // --- THE FINAL FIX IS HERE ---
            String audioUrl = jsonResponse.getString("audioFile");
            // --- END OF FINAL FIX ---

            System.out.println("Murf.ai API (Step 2: Downloading audio from " + audioUrl + ")...");
            HttpRequest downloadRequest = HttpRequest.newBuilder().uri(URI.create(audioUrl)).GET().build();
            HttpResponse<byte[]> downloadResponse = httpClient.send(downloadRequest, HttpResponse.BodyHandlers.ofByteArray());

            if (downloadResponse.statusCode() == 200) {
                System.out.println("Successfully downloaded audio from Murf.ai!");
                return downloadResponse.body();
            } else {
                throw new RuntimeException("Failed to download audio file from Murf.ai URL. Status code: " + downloadResponse.statusCode());
            }

        } else {
            String errorResponse = new String(generateResponse.body());
            System.err.println("Error from Murf.ai API: " + errorResponse);
            throw new RuntimeException("Failed to generate audio from Murf.ai. Status code: " + generateResponse.statusCode());
        }
    }
}
