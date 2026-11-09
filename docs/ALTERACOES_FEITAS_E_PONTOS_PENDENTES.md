# Revisão da base — alterações e pendências

## Alterações realizadas nesta cópia

1. `index.html`
   - Idioma declarado como `pt-BR`.
   - Viewport atualizado para permitir zoom do navegador e respeitar `viewport-fit=cover`.

2. `src/index.css`
   - Removido o bloqueio global de seleção de texto.
   - Mantido o comportamento de viewport controlado para a mesa, com prevenção de overscroll global.

3. `src/App.tsx`
   - Reserva inferior da navegação mobile centralizada no contêiner principal e adaptada à safe area do aparelho.
   - Removido o bloqueio global de seleção de texto da interface.
   - Corrigida a abertura da rolagem pela ficha para não reaproveitar o movimento anterior; tenta identificar o movimento pelo nome e usa um movimento básico padrão quando se trata de um teste de atributo.

4. `src/components/SidebarLeft.tsx`, `SidebarRight.tsx` e `CenterStage.tsx`
   - Removidas reservas inferiores repetidas que estavam reduzindo a área útil da mesa atrás da barra fixa.

5. `src/components/LobbyView.tsx`
   - Hub passou a ter rolagem vertical própria em telas pequenas.
   - Conteúdo principal deixa de ser centralizado verticalmente à força em telas estreitas.
   - Adicionada interface para editar nome, descrição e imagem de capa de uma campanha pelo cartão do Guardião.
   - Formulário de edição é rolável e usa alvos de toque maiores.

6. `src/context/VTTContext.tsx`
   - Adicionada ação `updateCampaignById` para editar uma campanha selecionada diretamente do Hub, sem depender de ela já estar aberta.
   - A função antiga `updateCampaignDetails` continua disponível e usa a nova implementação.

## O que ainda precisa ser testado

- Compilação completa, pois a instalação de dependências excedeu o limite de execução do ambiente; não foi possível confirmar `npm run build` ou `npm run lint`.
- Testes em aparelhos reais nas larguras 320, 360, 390, 412 e 430 px.
- Fluxo de edição de campanha com upload de imagem e confirmação de persistência.
- Todos os modais, teclado virtual, rolagem e navegação inferior.
- Fluxos de criação de personagem, rolagem de dados, chat e sincronização entre vários aparelhos.

## Riscos críticos encontrados no código original — não publicar antes de corrigir

1. **Não existe autenticação forte.** Identificadores de usuário e de Guardião são enviados pelo navegador e podem ser falsificados. `localStorage` não é prova de identidade.
2. **Leitura de campanhas precisa de autorização.** Rotas de listagem/detalhe não demonstram uma verificação de participação antes de entregar os dados completos.
3. **Notas privadas podem vazar.** O objeto completo da campanha pode conter `gmNotes`, `keeperNotes` e outras informações privadas. Não basta esconder esses campos no React: o servidor deve filtrar a resposta por usuário e papel.
4. **SSE precisa de autorização e filtragem.** O fluxo de eventos deve verificar participação e nunca transmitir notas secretas a todos os clientes.
5. **Chat e rolagens com visibilidade privada/cega/individual precisam ser filtrados no servidor**, tanto em consultas históricas quanto em eventos em tempo real.
6. **Persistência baseada em arquivos locais JSON e uploads locais** pode não sobreviver a reinícios/redeploys e pode não funcionar em hospedagem escalável. Usar banco de dados e armazenamento persistente adequados.
7. **Upload de imagem:** restringir tamanho, tipo real do arquivo, autorização, nome, quantidade e armazenamento; nunca confiar apenas no MIME enviado pelo navegador.
8. **Dados de demonstração:** `server/data/campaigns.json` e `chat.json` contêm uma campanha de exemplo e mensagens. Não tratar isso como dados reais do usuário nem publicar conteúdo secreto de demonstração.

## Requisito obrigatório para a reconstrução

Implementar autenticação verificável e autorização no backend ou nas regras de segurança do banco. O cliente nunca pode decidir sozinho quem é Guardião, quem pertence à campanha ou quem pode ler um segredo. Testar explicitamente com uma conta de Guardião e duas contas de Caçadores diferentes.
