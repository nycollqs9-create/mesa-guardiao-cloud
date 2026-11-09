# Revisão técnica desta entrega

## O que foi alterado nesta revisão

1. `src/index.css`
   - Camada adicional mobile-first para telas estreitas.
   - Regras de safe area e altura dinâmica mantidas/estendidas.
   - Campos de formulário com tamanho de fonte adequado para evitar zoom automático do Android.
   - Foco visível, prevenção de overflow horizontal e suporte a `prefers-reduced-motion`.
   - Melhor contenção de rolagem em painéis e modais.

2. `server/db.ts`
   - Instalação nova passa a iniciar com campanhas vazias, sem semear automaticamente a campanha de demonstração.
   - Entrada de campanha bloqueia o 7º participante total e informa o limite de 6 pessoas.

3. `server/data/campaigns.json` e `server/data/chat.json`
   - Dados ativos de demonstração removidos e substituídos por objetos vazios.

4. `README.md`
   - Instruções e limitações de segurança registradas.

## O que foi preservado

- Componentes React existentes.
- Cartilhas e movimentos definidos em `src/data/`.
- Tipos de domínio e cálculos de dados em `src/types/` e `src/utils/dice.ts`.
- Ferramentas do Guardião, fichas, cenas, chat e rolagens já existentes.
- Materiais privados de referência e capturas antigas, sem publicá-los como conteúdo do app.

## Limitações que impedem declarar o produto pronto para produção

A revisão encontrou riscos já documentados em `docs/ALTERACOES_FEITAS_E_PONTOS_PENDENTES.md`:

- Não há autenticação real verificável.
- O backend confia em `userId`/`keeperId` enviados pelo cliente.
- Algumas rotas entregam objetos completos sem autorização por membro e papel.
- SSE e histórico precisam de filtragem de visibilidade no servidor.
- O armazenamento JSON e uploads no disco local não são uma persistência adequada para hospedagem escalável.
- A camada visual não substitui regras de autorização.

Por isso, esta revisão melhora a experiência mobile e corrige o limite de participantes, mas **não autoriza usar campanhas privadas ou publicar a mesa como multiplayer público**. A próxima etapa obrigatória é implementar autenticação, autorização por campanha/role e persistência gerenciada, e então testar isolamento entre contas.

## Verificações

- Inspeção do ZIP e dos principais arquivos: realizada.
- Conferência estática das alterações: realizada.
- Build TypeScript/Vite: não executado nesta etapa (dependências não instaladas no ambiente de trabalho).
- Teste em celulares físicos: não executado.
- Teste de segurança entre contas: não executado.
