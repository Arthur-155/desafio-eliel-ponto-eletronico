package ponto.eletronico.desafio_eliel.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ponto.eletronico.desafio_eliel.Model.FuncionarioModel;
import ponto.eletronico.desafio_eliel.repository.FuncionarioRepository;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public List<FuncionarioModel> listarFuncionarios() {
        return funcionarioRepository.findAll();
    }

    public FuncionarioModel criarFuncionario (FuncionarioModel funcionario) {
        return funcionarioRepository.save(funcionario);
    }
}
