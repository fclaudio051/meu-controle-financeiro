"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.DIContainer = void 0;
const FileUserRepository_1 = require("../repositories/FileUserRepository");
const FilePersonRepository_1 = require("../repositories/FilePersonRepository");
const FileEntryRepository_1 = require("../repositories/FileEntryRepository");
const AuthService_1 = require("../services/AuthService");
const PersonService_1 = require("../services/PersonService");
const EntryService_1 = require("../services/EntryService");
const AuthController_1 = require("../controllers/AuthController");
const PersonController_1 = require("../controllers/PersonController");
const EntryController_1 = require("../controllers/EntryController");
/**
 * Container de Injeção de Dependência
 *
 * Este container implementa o padrão Singleton e gerencia todas as dependências
 * da aplicação, seguindo o princípio de Dependency Inversion do SOLID.
 *
 * Garante que cada instância seja criada apenas uma vez (Singleton) e
 * que as dependências sejam injetadas corretamente.
 */
class DIContainer {
    // ===========================================
    // REPOSITORIES - Camada de Acesso a Dados
    // ===========================================
    /**
     * Retorna uma instância singleton do FileUserRepository
     */
    get userRepository() {
        if (!this._userRepository) {
            this._userRepository = new FileUserRepository_1.FileUserRepository();
            console.log("🗄️ FileUserRepository instanciado");
        }
        return this._userRepository;
    }
    /**
     * Retorna uma instância singleton do FilePersonRepository
     */
    get personRepository() {
        if (!this._personRepository) {
            this._personRepository = new FilePersonRepository_1.FilePersonRepository();
            console.log("🗄️ FilePersonRepository instanciado");
        }
        return this._personRepository;
    }
    /**
     * Retorna uma instância singleton do FileEntryRepository
     */
    get entryRepository() {
        if (!this._entryRepository) {
            this._entryRepository = new FileEntryRepository_1.FileEntryRepository();
            console.log("🗄️ FileEntryRepository instanciado");
        }
        return this._entryRepository;
    }
    // ===========================================
    // SERVICES - Camada de Lógica de Negócio
    // ===========================================
    /**
     * Retorna uma instância singleton do AuthService
     * Injeta automaticamente o UserRepository
     */
    get authService() {
        if (!this._authService) {
            this._authService = new AuthService_1.AuthService(this.userRepository);
            console.log("⚙️ AuthService instanciado com UserRepository");
        }
        return this._authService;
    }
    /**
     * Retorna uma instância singleton do PersonService
     * Injeta automaticamente PersonRepository e EntryRepository
     */
    get personService() {
        if (!this._personService) {
            this._personService = new PersonService_1.PersonService(this.personRepository, this.entryRepository);
            console.log("⚙️ PersonService instanciado com PersonRepository e EntryRepository");
        }
        return this._personService;
    }
    /**
     * Retorna uma instância singleton do EntryService
     * Injeta automaticamente EntryRepository e PersonRepository
     */
    get entryService() {
        if (!this._entryService) {
            this._entryService = new EntryService_1.EntryService(this.entryRepository, this.personRepository);
            console.log("⚙️ EntryService instanciado com EntryRepository e PersonRepository");
        }
        return this._entryService;
    }
    // ===========================================
    // CONTROLLERS - Camada de Apresentação
    // ===========================================
    /**
     * Retorna uma instância singleton do AuthController
     * Injeta automaticamente o AuthService
     */
    get authController() {
        if (!this._authController) {
            this._authController = new AuthController_1.AuthController(this.authService);
            console.log("🎮 AuthController instanciado com AuthService");
        }
        return this._authController;
    }
    /**
     * Retorna uma instância singleton do PersonController
     * Injeta automaticamente o PersonService
     */
    get personController() {
        if (!this._personController) {
            this._personController = new PersonController_1.PersonController(this.personService);
            console.log("🎮 PersonController instanciado com PersonService");
        }
        return this._personController;
    }
    /**
     * Retorna uma instância singleton do EntryController
     * Injeta automaticamente o EntryService
     */
    get entryController() {
        if (!this._entryController) {
            this._entryController = new EntryController_1.EntryController(this.entryService);
            console.log("🎮 EntryController instanciado com EntryService");
        }
        return this._entryController;
    }
    // ===========================================
    // UTILITÁRIOS
    // ===========================================
    /**
     * Método para resetar todas as instâncias (útil para testes)
     */
    reset() {
        this._userRepository = undefined;
        this._personRepository = undefined;
        this._entryRepository = undefined;
        this._authService = undefined;
        this._personService = undefined;
        this._entryService = undefined;
        this._authController = undefined;
        this._personController = undefined;
        this._entryController = undefined;
        console.log("🔄 Container resetado - todas as instâncias foram limpas");
    }
    /**
     * Método para verificar quais dependências já foram instanciadas
     */
    getInstantiatedDependencies() {
        const instantiated = [];
        if (this._userRepository)
            instantiated.push("UserRepository");
        if (this._personRepository)
            instantiated.push("PersonRepository");
        if (this._entryRepository)
            instantiated.push("EntryRepository");
        if (this._authService)
            instantiated.push("AuthService");
        if (this._personService)
            instantiated.push("PersonService");
        if (this._entryService)
            instantiated.push("EntryService");
        if (this._authController)
            instantiated.push("AuthController");
        if (this._personController)
            instantiated.push("PersonController");
        if (this._entryController)
            instantiated.push("EntryController");
        return instantiated;
    }
    /**
     * Método para pré-carregar todas as dependências (útil para aplicações em produção)
     */
    preloadAll() {
        console.log("🚀 Pré-carregando todas as dependências...");
        // Acessar todos os getters para forçar a instanciação
        this.userRepository;
        this.personRepository;
        this.entryRepository;
        this.authService;
        this.personService;
        this.entryService;
        this.authController;
        this.personController;
        this.entryController;
        console.log("✅ Todas as dependências foram pré-carregadas");
    }
}
exports.DIContainer = DIContainer;
/**
 * Instância singleton do container
 * Esta é a única instância que deve ser usada em toda a aplicação
 */
exports.container = new DIContainer();
/**
 * Para usar em desenvolvimento, você pode pré-carregar as dependências
 * Descomente a linha abaixo se quiser que todas sejam carregadas na inicialização
 */
// if (process.env.NODE_ENV === 'development') {
//   container.preloadAll();
// }
