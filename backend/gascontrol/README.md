# Sistema de Controle de Gás para Condomínios

Sistema Django para gestão de consumo de gás em condomínios com PostgreSQL.

## 🚀 Funcionalidades

- ✅ Cadastro de condomínios, torres e apartamentos
- ✅ Controle de moradores e s  
- ✅ Registro de leituras de consumo
- ✅ Relatórios por período
- ✅ Interface admin completa
- ✅ API RESTful completa
- ✅ **Documentação interativa com Swagger**
- ✅ **Interface web para registro de leituras**

## 🛠️ Tecnologias

- Django 4.2.7
- Django REST Framework
- PostgreSQL
- Docker & Docker Compose
- Gunicorn
- **Swagger/OpenAPI**
- **HTML, CSS, JavaScript frontend**

## 📸 Screenshots

<!-- Adicione suas imagens aqui -->
### API
![API](/images/API.png)
### WebPage
![Registro de Leituras](/images/webpage.png)
### Documentação Swagger
![Swagger API](/images/swagger.png)

## 🐳 Execução com Docker (Recomendado)

### 1. Clone o projeto
```bash
git clone <url-do-repositorio>
cd gascontrolproject
```

### 2. Configure ambiente
```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Execute
```bash
docker-compose up --build
```

### 4. Acesse as interfaces
- **🌐 Interface Web:** http://localhost:8000/leituras/registro/
- **📖 Swagger API Docs:** http://localhost:8000/api/doc/
- **🔌 API REST:** http://localhost:8000/
- **⚙️ Admin Django:** http://localhost:8000/admin/

## 🖥️ Execução Tradicional (venv)

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📡 API RESTful Endpoints

### 🔹 Documentação Interativa
- `GET /api/docs/` - **Swagger UI** (Documentação interativa)
- `GET /api/schema/` - Schema OpenAPI

### 🔹 Condomínios
- `GET    /api/condominios/` - Lista condomínios
- `POST   /api/condominios/` - Cria condomínio

### 🔹 Torres
- `GET    /api/torres/` - Lista torres
- `POST   /api/torres/` - Cria torre

### 🔹 Apartamentos  
- `GET    /api/apartamentos/` - Lista apartamentos
- `POST   /api/apartamentos/` - Cria apartamento

### 🔹 Gasômetros
- `GET    /api/gasometros/` - Lista gasômetros
- `POST   /api/gasometros/` - Cria gasômetro

### 🔹 Leituras
- `GET    /api/leituras/` - Lista leituras
- `POST   /api/leituras/` - Registra leitura

### 🔹 Relatórios
- `GET    /api/relatorios/consumo-apartamento/`
- `GET    /api/relatorios/consumo-torre/`
- `GET    /api/relatorios/consumo-condominio/`

## 🌐 Interface Web

### Página de Registro de Leituras
- **URL:** http://localhost:8000/leituras/registro/
- **Funcionalidades:**
  - ✅ Seleção de gasômetros
  - ✅ Registro de data e consumo
  - ✅ Seleção de periodicidade
  - ✅ Validação em tempo real
  - ✅ Design responsivo

### Características do Frontend
- **Design:** Moderno com gradiente azul
- **Responsivo:** Adaptável a mobile e desktop
- **Interativo:** Feedback visual imediato
- **Intuitivo:** Formulário simplificado

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
DB_NAME=gascontrol_db
DB_USER=django_user
DB_PASSWORD=password
SECRET_KEY=sua-chave-super-secreta
DJANGO_ENV=production
DEBUG=False
```

### Configuração Swagger (settings.py)
```python
INSTALLED_APPS = [
    'drf_yasg',  # Documentação API
    # ... outras apps
]

# Configuração Swagger
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Basic': {
            'type': 'basic'
        }
    }
}
```

## 👤 Primeiros Passos

### 1. Criar superusuário
```bash
docker-compose exec web python manage.py createsuperuser
```

### 2. Acessar admin
- URL: http://localhost:8000/admin/
- Cadastrar: Condomínios, Torres, Apartamentos, Gasômetros

### 3. Usar interface web
- Acessar: http://localhost:8000/leituras/registro/
- Registrar primeiras leituras

### 4. Explorar API
- Documentação: http://localhost:8000/api/doc/
- Testar endpoints diretamente


## 🚨 Solução de Problemas

### Erro de porta
```bash
# Liberar porta 8000
sudo lsof -t -i:8000 | xargs kill -9
```

### Erro Docker
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Static files não carregam
```bash
python manage.py collectstatic
```

## 📝 Licença

MIT License - © 2025 Renato Sorgatto

## 📞 Suporte

Para issues e dúvidas, abra uma issue no repositório ou contate o desenvolvedor.
