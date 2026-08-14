# Escritório Virtual VR

Protótipo interno do escritório virtual da operação Victor Romero.

## Objetivo do Sprint 01

Validar a experiência central: duas pessoas entram pelo navegador, aparecem como avatares no mesmo escritório, caminham pelo mapa e iniciam interação por proximidade.

## Base técnica

A V0 usa **WorkAdventure self-hosted** como motor para presença, movimentação multiplayer e comunicação por proximidade. O projeto deste repositório funciona como camada de configuração, documentação e customização visual/funcional.

A documentação oficial do WorkAdventure atualmente recomenda Docker para ambiente local e suporta Docker Compose ou Helm em produção.

## Primeira execução local

Pré-requisitos:

- Git
- Docker Desktop / Docker Engine com Compose
- 8 GB de RAM disponíveis (recomendado)

```bash
chmod +x scripts/bootstrap-workadventure.sh
./scripts/bootstrap-workadventure.sh
```

Depois, siga as instruções exibidas pelo script. No ambiente local padrão, o WorkAdventure fica disponível em:

```text
http://play.workadventure.localhost/
```

O ambiente oficial de desenvolvimento inicia com OIDC mock. Usuário de teste padrão informado pelo projeto upstream:

```text
User1 / pwd
```

Para teste anônimo, use o comando indicado em `docs/SPRINT-01.md`.

## Escopo do escritório V0

- Sala do CEO — Victor Romero
- Sala do Diretor Audiovisual
- Sala de Produção — 3 mesas
- Auditório com acesso interno
- 4 Salas Privativas
- Área de Convivência
- Recepção

## Direção visual

Pixel art isométrico premium, com arquitetura corporativa de alto padrão. A interface de software permanece moderna; o mundo é game, a UI não precisa ser retrô.

## Status

- [x] Repositório criado
- [x] Arquitetura inicial definida
- [x] Bootstrap do WorkAdventure preparado
- [ ] Dois usuários conectados no mesmo mapa
- [ ] Mapa VR V0 customizado
- [ ] Regras de sala privativa
- [ ] Auditório interno
- [ ] Identidade visual final

## Licença

Este repositório contém apenas nossa camada de configuração e customização. O WorkAdventure possui licença própria; antes de qualquer distribuição comercial, os termos do projeto upstream devem ser revisados separadamente.
