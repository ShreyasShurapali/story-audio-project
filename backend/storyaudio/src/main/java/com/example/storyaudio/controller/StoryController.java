package com.example.storyaudio.controller;

import com.example.storyaudio.dto.GenerateRequest;
import com.example.storyaudio.dto.GenerateResponse;
import com.example.storyaudio.service.AiApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    @Autowired
    private AiApiService aiApiService;

    @PostMapping("/generate")
    public GenerateResponse generateStory(@RequestBody GenerateRequest request) throws IOException, InterruptedException {
        System.out.println("Received prompt: " + request.getPrompt());

        // 1. Generate the story using Gemini
        String story = aiApiService.generateStory(request.getPrompt());

        // 2. Generate REAL audio from the story text using Murf.ai
        byte[] audioBytes = aiApiService.generateAudio(story);

        // 3. Encode the audio to Base64 to send it as JSON
        String audioBase64 = Base64.getEncoder().encodeToString(audioBytes);

        return new GenerateResponse(story, audioBase64);
    }
}
