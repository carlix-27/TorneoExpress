package com.TorneosExpress.service;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private PlayerService playerService;

    @Autowired
    private TeamService teamService;

    public List<Tournament> getTournamentsByUser(Long userId) {
        return tournamentRepository.findByCreatorId(userId);
    }

    public Tournament createTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public boolean isTournamentNameUnique(String name) {
        return tournamentRepository.findByName(name).isEmpty();
    }

    public Tournament getTournamentById(Long id) {
        Optional<Tournament> optionalTournament = tournamentRepository.findById(id);
        return optionalTournament.orElse(null);
    }
    public Tournament updateTournament(Tournament tournament) {
        if (tournament.getId() == null || !tournamentRepository.existsById(tournament.getId())) {
            return null;
        }
        return tournamentRepository.save(tournament);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }


    public List<Tournament> getActiveTournaments() {
        return tournamentRepository.findByisActiveTrue();
    }

    public void accessToPublicTournament(Long tournamentId, Long userId, Long teamId){
        processAccessRequest(tournamentId, userId, teamId);
    }

    public boolean processAccessRequest(Long id, Long userId, Long teamId){ // Manejo de la solicitud a un torneo privado
        // Base de datos de id, si existe el usuario

        // Optimizaciones
        // - usar el mismo team sin la necesidad de recurrir nuevamente a la base de datos
        // usar optionals para definir los teams y los tournaments, de esta forma evitamos tener un Tournament.
        // Todo -> Agregar Optional en lugar de manejarlo como lo manejamos acá!
        Optional<Player> playerOptional = playerService.getPlayerById(userId);
        Team team = teamService.findById(teamId); // Abarcar si el team realmente existe.
        if(playerOptional.isEmpty()){
            throw new NullPointerException(userId + "no encontrado");
        }

        if(team == null){ // Fijate de crear tus propias excepciones!
            throw new IllegalArgumentException();
        }
        // si fue encontrado. Me quedo con el jugador.
        Player player = playerOptional.get();
        // Es capitán?
        if(player.isIs_Captain()){
            if(isTeamInTournament(teamId, id)){ // true
                throw new IllegalArgumentException("Tu equipo ya está en este torneo");
                // ya está inscripto? -> Ver la tabla. El equipo ya está inscripto?
                // ¿Cómo chequear si ya está inscripto o no?
            }
            sendRequest(teamId, id); // Enviar solicitud al creador del Torneo
        }

        // chequear si el id del torneo existe
        Tournament tournament = getTournamentById(id);
        if(tournament != null){
            List<Team> participatingTeams = tournament.getParticipatingTeams();
            // Chequear si los equipos que tiene no excedería la cantidad previamente dicha en el torneo -> TODO!
            participatingTeams.add(team); // Si es todo valido, directamente lo agrego.
            tournament.setParticipatingTeams(participatingTeams);
            tournamentRepository.save(tournament);
            return true;
        }
        return false;
        // ---
        // en la base, tiene que tener una relación entre torneos y equipos, o torneos y capitan
        // count de la cantidad de equipos mostrados.
    }

    /*private boolean isTeamInTournament(Long teamId, Long tournamentId){
        Team team = teamService.findById(teamId); // Busco el equipo que quiere inscribirse
        Tournament tournament = getTournamentById(tournamentId); // Busco el torneo donde se quiere inscribir
        List<Tournament> activeTournaments = team.getActiveTournaments(); // En que torneos juega el equipo? // Obtener el id del torneo activo y armo como quiero que se comparen.
        return activeTournaments.contains(tournament); // Ver la comparación, tengo que especificar que es lo que quiero comparar.
    }*/

    private boolean isTeamInTournament(Long teamId, Long tournamentId){
        Tournament tournament = getTournamentById(tournamentId);
        if(tournament == null) return false;
        List<Team> participatingTeams = tournament.getParticipatingTeams();
        return participatingTeams.stream().anyMatch(team -> team.getId().equals(teamId));
    }

    private void sendRequest(Long teamId, Long tournamentId){
        Team team = teamService.findById(teamId);
        Tournament tournament = getTournamentById(tournamentId);
        List<Team> participationRequest = tournament.getParticipationRequests();
        participationRequest.add(team);
        tournament.setParticipationRequests(participationRequest);
        tournamentRepository.save(tournament); // lo guardo en la base de datos.
    }
}
