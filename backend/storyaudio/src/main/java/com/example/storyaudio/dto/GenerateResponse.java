package com.example.storyaudio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // Creates a constructor with all fields.
@NoArgsConstructor  // Creates a default no-argument constructor.
public class GenerateResponse {
    private String story;
    private String audioBase64; // We will send audio data as a Base64 encoded string
}
