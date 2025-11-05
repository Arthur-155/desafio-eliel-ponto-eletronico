package ponto.eletronico.desafio_eliel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ponto.eletronico.desafio_eliel.Model.FuncionarioModel;

@Repository
public interface FuncionarioRepository extends JpaRepository<FuncionarioModel,Long> {
}
