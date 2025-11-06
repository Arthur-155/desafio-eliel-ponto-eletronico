package ponto.eletronico.desafio_eliel.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ponto.eletronico.desafio_eliel.Model.FuncionarioModel;
import ponto.eletronico.desafio_eliel.repository.FuncionarioRepository;

import java.util.List;
import java.util.stream.Collectors;

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

    public void deletarFuncionario(Long id) {
        funcionarioRepository.deleteById(id);
    }

    public FuncionarioModel atualizarFuncionario(Long id, FuncionarioModel funcionario) {
        FuncionarioModel novoFuncionario = funcionarioRepository.findById(id).get();
        novoFuncionario.setHoraEntrada(funcionario.getHoraEntrada());
        novoFuncionario.setMinutosEntrada(novoFuncionario.getMinutosEntrada());
        novoFuncionario.setSegundosEntrada(novoFuncionario.getSegundosEntrada());
        return funcionarioRepository.save(novoFuncionario);
    }

}
