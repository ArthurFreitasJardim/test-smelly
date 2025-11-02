import { UserService } from '../src/userService';

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // Teste 1 — criação e busca de usuário
  test('deve criar e buscar um usuário corretamente', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioCriado).toHaveProperty('id');
    expect(usuarioBuscado).toEqual(
      expect.objectContaining({
        nome,
        email,
        idade,
        status: 'ativo',
      })
    );
  });

  // Teste 2a — desativar usuário comum
  test('deve desativar usuário comum corretamente', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  // Teste 2b — não deve desativar usuário administrador
  test('não deve desativar usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  // Teste 3 — relatório de usuários
  test('deve gerar um relatório contendo informações dos usuários', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(`Nome: ${usuario1.nome}`);
    expect(relatorio).toContain('Relatório de Usuários');
    expect(typeof relatorio).toBe('string');
  });

  // Teste 4 — criação de usuário menor de idade
  test('deve lançar erro ao criar usuário menor de idade', () => {
    // Arrange, Act & Assert
    expect(() =>
      userService.createUser('Menor', 'menor@email.com', 17)
    ).toThrow('O usuário deve ser maior de idade.');
  });

  // Teste 5 — lista vazia
  test('deve retornar uma lista vazia quando não há usuários', () => {
    // Arrange & Act
    const usuarios = userService.listAllUsers();

    // Assert
    expect(usuarios).toEqual([]);
  });
});
