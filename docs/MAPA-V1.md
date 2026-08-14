# Escritório Virtual VR — Planta Jogável V1

## Objetivo

Criar a primeira planta funcional do escritório antes do acabamento visual premium. A prioridade é circulação clara, leitura imediata dos ambientes e teste das mecânicas sociais.

## Princípio de navegação

A recepção é apenas a entrada. Depois que o usuário entra no núcleo do escritório, todos os ambientes são acessíveis por circulação interna. O auditório possui porta para o corredor interno e nunca exige sair do escritório ou retornar à recepção.

## Planta conceitual

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ CEO — Victor Romero │ Diretor Audiovisual │ Produção — 3 mesas         │
│                     │                     │                             │
├───────────┬─────────┴──────────┬──────────┴─────────────────────────────┤
│ Privativa │                    CORREDOR CENTRAL                          │
│ 01        │                                                                  │
├───────────┤                                                                  │
│ Privativa │                                                                  │
│ 02        │                                                                  │
├───────────┤                                                                  │
│ Privativa │                                                                  │
│ 03        │                                                                  │
├───────────┤                                                                  │
│ Privativa │                                                                  │
│ 04        │                                                                  │
├───────────┴───────────────────────────────┬─────────────────────────────┤
│ Área de Convivência                      │ AUDITÓRIO                    │
│                                          │ ↑ porta pelo corredor interno│
├──────────────────────────────────────────┴─────────────────────────────┤
│ RECEPÇÃO / ENTRADA                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

A geometria final pode mudar durante o teste, mas a relação entre os ambientes deve permanecer simples e legível.

## Ambientes e comportamento

### Recepção
- Spawn inicial dos usuários.
- Identidade visual do escritório.
- Acesso direto ao corredor central.

### Sala CEO — Victor Romero
- Sala individual.
- Mesa executiva e área curta para conversa.
- Zona de reunião por proximidade.

### Sala Diretor Audiovisual
- Sala individual.
- Workstation principal.
- Zona de reunião por proximidade.

### Produção
- Três posições de trabalho.
- Espaço compartilhado.
- Comunicação normal por proximidade.

### Auditório
- Acesso exclusivamente conectado ao corredor interno na V1.
- Espaço para reuniões gerais/apresentações.
- Preparado para futura mecânica de palco/apresentador.

### Salas Privativas 01–04
- Porta individual.
- Ao entrar, o avatar deve sinalizar estado `Privativo`.
- Comunicação de proximidade com usuários externos deve ficar bloqueada.
- Na V1 podemos validar primeiro a geometria e depois ativar a regra de privacidade.

### Área de Convivência
- Espaço informal.
- Comunicação livre por proximidade.

## Direção visual V2

A V1 usa assets provisórios para validar UX. Depois da aprovação da planta, substituir por pixel art isométrico premium:

- piso em pedra/mármore ou porcelanato sofisticado;
- madeira escura e detalhes metálicos;
- vidro e divisórias elegantes;
- iluminação quente;
- mobiliário executivo;
- plantas e decoração minimalista;
- paleta sofisticada e consistente;
- evitar aparência de escritório genérico ou infantil.

A referência estética continua sendo um jogo social retrô/pixel-art, porém com arquitetura corporativa de alto padrão.

## Critérios de aprovação da V1

1. Usuário nasce na recepção.
2. Consegue chegar a todas as salas sem sair do escritório.
3. Auditório é acessado pelo corredor interno.
4. Nenhum ambiente importante exige atravessar outro ambiente privado.
5. Duas pessoas conseguem circular simultaneamente sem gargalos.
6. Portas e corredores são visualmente fáceis de entender.
7. Produção comporta três estações.
8. Existem quatro salas privativas distintas.
9. A planta funciona antes de receber decoração final.

## Próximas mecânicas

- nomes acima dos avatares;
- status Disponível / Ocupado / Privativo;
- vídeo/áudio por proximidade;
- bloqueio de comunicação nas salas privativas;
- presença por sala;
- personalização de avatar;
- auditório com apresentação para grupo.
