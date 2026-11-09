# Mesa do Guardião — pacote de referência para Google AI Studio Build

Este ZIP contém a base anterior da Mesa do Guardião, algumas correções realizadas nesta cópia e um prompt completo para reconstruir o aplicativo como uma nova versão mobile-first.

## Comece por aqui

1. Abra `GEMINI_BUILD_PROMPT.md` e copie o prompt para o Google AI Studio Build.
2. Anexe este ZIP como referência do projeto.
3. Peça que o Build leia primeiro os arquivos `docs/RESUMO_DO_PROJETO.md` e `docs/ALTERACOES_FEITAS_E_PONTOS_PENDENTES.md`.
4. Oriente o Build a reconstruir o app com prioridade absoluta para celular Android, sem copiar o layout antigo.

## O que há no pacote

- `src/`: aplicação React + TypeScript anterior, com correções pontuais aplicadas.
- `server.ts` e `server/`: servidor e persistência da versão anterior; devem ser tratados como referência, não como uma solução de segurança pronta para produção.
- `public/assets/aistudio/`: materiais de referência fornecidos pelo proprietário.
- `.aistudio/artifacts/`: capturas de versões antigas para entender telas e funcionalidades.
- `docs/`: resumo do produto, alterações e riscos pendentes.
- `GEMINI_BUILD_PROMPT.md`: prompt de reconstrução completo.

## Correções feitas nesta cópia

- Layout do Hub com rolagem vertical própria.
- Barra inferior com safe area e reserva de espaço centralizada.
- Remoção de reservas inferiores duplicadas nos painéis da mesa.
- Viewport permite zoom e idioma da página está definido como pt-BR.
- Edição de nome, descrição e capa da campanha no Hub, para o Guardião.
- Ajuste para a rolagem aberta a partir da ficha não herdar silenciosamente o movimento anterior.

## Importante

A instalação das dependências excedeu o limite do ambiente de análise. A sintaxe dos 25 arquivos TypeScript/TSX foi verificada e não apresentou erros de transpilação, mas `npm run build` e a validação completa de tipos não foram concluídos.

A versão anterior também contém riscos importantes de autenticação e privacidade. Consulte `docs/ALTERACOES_FEITAS_E_PONTOS_PENDENTES.md`. Não publique o servidor antigo como multiplayer público sem corrigir esses pontos.

Os PDFs incluídos foram fornecidos pelo proprietário e servem apenas como referência privada. Não publique os arquivos nem reproduza longos trechos protegidos no aplicativo.


## Ajustes desta revisão mobile

- Hub inicia vazio; os dados antigos de demonstração foram removidos dos arquivos ativos `server/data/campaigns.json` e `server/data/chat.json`.
- Limite de 6 participantes por campanha aplicado na função de entrada do backend (1 Guardião + até 5 Caçadores).
- Camada CSS adicional para telas Android de 320–430 px, safe areas, teclado, modais roláveis, foco visível e redução de movimento.
- Os arquivos de referência em `public/assets/aistudio/` foram preservados.

## Limitação crítica antes de uso público

Esta base **ainda não está pronta para multiplayer público ou dados reais sensíveis**. A revisão de segurança em `docs/ALTERACOES_FEITAS_E_PONTOS_PENDENTES.md` continua válida: o projeto atual usa identidade simulada no cliente, rotas que confiam em identificadores enviados pelo navegador, armazenamento JSON local e eventos SSE sem isolamento completo. O limite de participantes é uma regra funcional, não uma barreira de segurança contra clientes falsificados.

Antes de publicar, integrar autenticação real (por exemplo, Firebase Authentication), banco persistente e regras/handlers server-side que validem membership e role em todas as rotas, uploads, histórico e eventos. Nunca inserir credenciais privadas no frontend. Os arquivos JSON são adequados apenas para desenvolvimento local.
