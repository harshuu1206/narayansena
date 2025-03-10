package org.uway.NarayanSena.services;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CorsService {
    public List<String> getAllowedOrigins() {
        return List.of(
                "https://narayansena-frontend-hs.azurewebsites.net", // ✅ Frontend domain
                "http://localhost:8090",
                "http://localhost:63342",
                "http://localhost:3000",
                "http://10.0.1.4:8000",
                "http://20.197.35.47:8000",
                "http://20.197.35.47:8090"/// Allow frontend URL

        );
    }

    public List<String> getAllowedOriginPatterns() {
        return List.of(
                "http://localhost:*",  // ✅ Allow localhost on any port
                "https://*.azurewebsites.net"  // ✅ Allow Azure subdomains
        );
    }
}
