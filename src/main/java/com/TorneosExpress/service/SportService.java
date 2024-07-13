package com.TorneosExpress.service;


import com.TorneosExpress.model.Sport;
import com.TorneosExpress.repository.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SportService {

    private final SportRepository sportRepository;

    @Autowired
    public SportService(SportRepository sportRepository) {
        this.sportRepository = sportRepository;
    }

    public Sport getSportById(Long sportId) {
        return sportRepository.findBySportId(sportId);
    }

    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    public Sport createSport(String sportName, int num_players) {
        Sport sport = new Sport();
        sport.setSportName(sportName);
        sport.setNum_players(num_players);
        return sportRepository.save(sport);
    }

    public void deleteSport(Long sportId) {
        sportRepository.deleteById(sportId);
    }

    public Sport updateSport(Sport sport) {
        if (sport.getSportId() == null || !sportRepository.existsById(sport.getSportId())) {
            return null; 
        }
        return sportRepository.save(sport);
    }

}