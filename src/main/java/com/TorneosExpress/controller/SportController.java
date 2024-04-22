package com.TorneosExpress.controller;


import com.TorneosExpress.dto.CreateSportRequest;
import com.TorneosExpress.dto.DeleteSportRequest;
import com.TorneosExpress.dto.SportDto;
import com.TorneosExpress.dto.UpdateSportRequest;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.service.SportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sports")
public class SportController {

    @Autowired
    private SportService sportService;

    @GetMapping("")
    public List<Sport> getAllSports(){
        return sportService.getAllSports();
    }

    @GetMapping("/{id}")
    public Optional<Sport> getSportById(@PathVariable Long id) {
        return sportService.getSportById(id);
    }

    @PostMapping("/create")
    public ResponseEntity<SportDto> createSport(@RequestBody CreateSportRequest request){
        Sport createdSport =  sportService.createSport(request.getName(), request.getNum_players());
        SportDto sportDto = new SportDto(
                createdSport.getSportId(),
                createdSport.getSportName(),
                createdSport.getNum_players()
        );
        return ResponseEntity.ok(sportDto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SportDto> updateSport(@RequestBody UpdateSportRequest request) {
        Sport newSport = sportService.updateSport(request.getId(), request.getNew_name(), request.getNew_num_players());
        SportDto sportDto = new SportDto(
                newSport.getSportId(),
                newSport.getSportName(),
                newSport.getNum_players()
        );
        return ResponseEntity.ok(sportDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSport(@RequestBody DeleteSportRequest request) {
        sportService.deleteSport(request.getId());
    }
}