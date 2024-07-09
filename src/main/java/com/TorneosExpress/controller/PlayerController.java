package com.TorneosExpress.controller;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.service.PlayerService;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mercadopago.MercadoPagoConfig;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/user")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/players/{id}")
    public Optional<Player> getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id);
    }

    @GetMapping("/{userId}/premium")
    public ResponseEntity<Map<String, Boolean>> checkPremiumStatus(@PathVariable Long userId) {
        boolean isPremium = playerService.isPremiumUser(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isPremium", isPremium);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{userId}/team-owner")
    public ResponseEntity<?> checkIfUserIsCaptain(@PathVariable Long userId){
        if(playerService.isCaptain(userId)){
            return ResponseEntity.ok().body("El usuario es capitan");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario no es capitán");
    }


    @GetMapping("/players/findByName/{name}")
    public ResponseEntity<List<Player>> getPlayersByName(@PathVariable String name) {
        List<Player> response = playerService.getPlayerByName(name);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/create_preference")
    public Preference createPreference() throws MPException, MPApiException {

        MercadoPagoConfig.setAccessToken("APP_USR-6665380637091560-070820-649b96fd61881045c6aea8bc93be58d1-1893369186");
        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .id("1")
                .title("Torneos Express premium")
                .currencyId("ARS")
                .pictureUrl("jetbrains://idea/navigate/reference?project=lab1&path=static/img/trophy-award-winner.webp")
                .description("Premium para la aplicación de Torneos Express")
                .categoryId("sport")
                .quantity(1)
                .unitPrice(new BigDecimal(50))
                .build();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://127.0.0.1:8080/buyPremiumSuccess.html")
                        .failure("http://127.0.0.1:8080/buy_premium.html")
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(itemRequest);

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items).backUrls(backUrls).autoReturn("approved").build();

        PreferenceClient client = new PreferenceClient();

        return client.create(preferenceRequest);
    }

    @PostMapping("/upgrade/{userId}")
    public ResponseEntity<?> upgradeToPremium(@PathVariable Long userId) {
        boolean isUpgradeSuccessful = playerService.upgradeToPremium(userId);

        if (isUpgradeSuccessful) {
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upgrade player to Premium");
        }
    }

    @GetMapping("/players")
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> response = playerService.getAllPlayers();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{playerId}/teams")
    public List<Team> getTeamsByPlayerId(@PathVariable Long playerId) {
        return playerService.findTeamsByPlayerId(playerId);
    }

}
