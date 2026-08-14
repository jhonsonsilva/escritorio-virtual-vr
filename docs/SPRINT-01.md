# Sprint 01 — Dois Avatares no Mesmo Escritório

## Meta

Provar a tese central antes de investir na arte final: dois usuários reais devem conseguir abrir o escritório em navegadores diferentes, entrar no mesmo mapa, ver um ao outro, caminhar e acionar a comunicação por proximidade.

## Critério de aprovação

O Sprint 01 é aprovado quando:

1. Usuário A entra no escritório pelo navegador.
2. Usuário B entra pelo segundo navegador/dispositivo.
3. Ambos aparecem simultaneamente no mesmo mapa.
4. Ambos conseguem caminhar com teclado.
5. A posição é sincronizada em tempo real.
6. Ao se aproximarem, o motor oferece/inicia a experiência de comunicação por proximidade.
7. Ao se afastarem, deixam a zona de conversa.
8. A sessão permanece estável durante pelo menos 15 minutos.

## Arquitetura V0

```text
Navegador A ─┐
             ├── WorkAdventure ── Mundo/Mapa VR
Navegador B ─┘        │
                      ├── presença multiplayer
                      ├── posição dos avatares
                      ├── áudio/vídeo por proximidade
                      └── screen sharing (Sprint posterior)
```

## Ambientes do mapa final

O mapa de teste pode começar simples, mas as zonas reservadas serão:

- `ceo_victor_romero`
- `diretor_audiovisual`
- `producao`
- `auditorio`
- `privativa_01`
- `privativa_02`
- `privativa_03`
- `privativa_04`
- `convivencia`
- `recepcao`
- `corredor_central`

### Regra estrutural obrigatória

O auditório possui **porta de acesso pelo corredor interno**. Nenhum usuário que já esteja dentro do escritório precisa atravessar a recepção ou sair do mapa para entrar no auditório.

## Comportamentos futuros já reservados

### Sala privativa

Ao entrar em uma das quatro salas privativas:

- status visual: `PRIVATIVO`;
- chamadas espontâneas: bloqueadas;
- comunicação por proximidade externa: bloqueada;
- notificações de interação: bloqueadas;
- presença continua visível para a equipe.

### Auditório

Ao atravessar a porta interna:

- usuário entra na zona do auditório;
- microfone inicia desligado para participantes;
- apresentador pode compartilhar tela;
- participantes podem solicitar fala.

Esses comportamentos não bloqueiam a aprovação do Sprint 01.

## Teste local

### 1. Preparar upstream

```bash
./scripts/bootstrap-workadventure.sh
```

### 2. Iniciar

No diretório gerado pelo bootstrap:

```bash
docker compose up
```

O ambiente upstream pode exigir a configuração/fluxo de autenticação de desenvolvimento. Para desenvolvimento anônimo, a documentação oficial também descreve a variável `DISABLE_ANONYMOUS=true/false` conforme a versão; conferir `.env` gerado pelo upstream antes de alterar.

### 3. Testar dois usuários

- Navegador normal: usuário A.
- Janela anônima ou outro dispositivo: usuário B.
- Entrar no mesmo mapa.
- Caminhar até os avatares ficarem próximos.
- Autorizar microfone/câmera quando solicitado.

## Próximo Sprint

Depois da aprovação do multiplayer básico:

**Sprint 02 — Planta VR jogável**

Transformar o mapa simples no escritório aprovado, mantendo circulação clara e estética pixel art isométrica de alto padrão.
