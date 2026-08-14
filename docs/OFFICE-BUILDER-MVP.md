# VR Office Builder — MVP

## Mudança de estratégia

A partir desta versão, o layout visual do escritório deixa de ser desenhado manualmente por scripts de geração de mapas. O produto passa a ter um editor visual próprio.

## Objetivo do primeiro marco

O usuário deve conseguir:

1. Abrir uma tela vazia em grade.
2. Escolher um objeto em uma biblioteca lateral.
3. Inserir o objeto no escritório.
4. Selecionar e arrastar o objeto.
5. Girar o objeto.
6. Duplicar ou apagar o objeto.
7. Salvar o projeto em JSON.
8. Reabrir o projeto sem perder o layout.
9. Clicar em Testar para futuramente converter o projeto para um mapa jogável WorkAdventure.

## Objetos iniciais

- Parede
- Porta
- Piso
- Mesa
- Cadeira
- Sofá
- Planta
- TV
- Tapete
- Balcão
- Estação de trabalho
- Cadeira de auditório

## Tipos de zona

- Normal
- Reunião
- Privativo
- Auditório
- Convivência

## Arquitetura

O Office Builder NÃO deve editar TMJ diretamente como fonte de verdade.

Fonte de verdade:

`office-project.json`

Estrutura conceitual:

```json
{
  "version": 1,
  "name": "Meu Escritório",
  "grid": { "size": 32, "width": 40, "height": 28 },
  "objects": [],
  "zones": [],
  "spawn": { "x": 2, "y": 2 }
}
```

Cada objeto deve possuir pelo menos:

- id
- assetId
- category
- x
- y
- width
- height
- rotation
- collision
- zIndex

## Separação de responsabilidades

### Builder
Editor visual e fonte de verdade do layout.

### Project JSON
Formato proprietário e independente do WorkAdventure.

### Exporter
Transforma Project JSON em TMJ/mapa compatível com WorkAdventure.

### Runtime
Executa o mapa e as regras de interação/multiplayer.

## Interface MVP

Barra superior:
- Nome do escritório
- Desfazer
- Refazer
- Salvar
- Testar escritório

Painel esquerdo:
- Construção
- Mobiliário
- Decoração
- Zonas

Canvas central:
- Grade
- Pan
- Zoom
- seleção
- drag-and-drop
- snapping

Painel direito quando houver seleção:
- posição X/Y
- rotação
- colisão
- duplicar
- excluir

## Critério de aprovação da Fase 1

A Fase 1 só é considerada pronta quando, sem editar código, for possível abrir o Builder, colocar uma mesa na grade, arrastá-la com o mouse, girá-la, salvar, atualizar a página e vê-la exatamente na mesma posição.

## Fase 2

Depois da aprovação da Fase 1:

- paredes desenháveis
- portas funcionais
- zonas/salas
- colisões automáticas
- catálogo visual de assets
- exportação TMJ
- botão Testar integrado ao WorkAdventure

## Regra de produto

Não voltar a usar geração procedural de layout como ferramenta principal de direção de arte. Scripts podem exportar ou converter dados, mas a composição visual deve ser controlada pelo usuário no Builder.
