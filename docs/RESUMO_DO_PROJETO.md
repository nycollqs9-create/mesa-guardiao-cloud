# Mesa do Guardião — resumo para reconstrução

## Objetivo

Uma mesa virtual narrativa, em português brasileiro, dedicada a campanhas de **Monstro da Semana**. O app deve ser pensado primeiro para celulares Android em orientação vertical. O grupo típico tem 1 Guardião e 4–5 Caçadores, com suporte para até 6 participantes simultâneos no total.

## Papéis

- **Guardião:** cria e administra a campanha, prepara mistérios, cenas, ameaças, pistas, relógio de contagem regressiva e diário; decide o que revelar aos jogadores.
- **Caçador:** participa da campanha, cria e administra sua própria ficha, acompanha cenas compartilhadas, rola dados, conversa e vê o conteúdo que o Guardião revelou.

## Funções já representadas no projeto-fonte

- Hub de campanhas: criar, entrar por código, listar, arquivar, sair e excluir (com confirmação).
- Perfil de usuário: nome e imagem.
- Fichas pré-configuradas por cartilha/playbook, com atributos, aparência, movimentos, características especiais, armas/equipamentos e histórico.
- Atributos: Braveza, Esperteza, Estranheza, Firmeza e Sutileza.
- Rolagem 2d6 com modificadores, descrição da ação e resultados por faixa.
- Registro compartilhado de rolagens e chat.
- Modos de visibilidade de mensagens/rolagens: pública, privada, cega e individual (a semântica exata deve ser implementada e testada com permissões no servidor).
- Ficha do Caçador: dano/ferimentos, instabilidade, armadura, Sorte, experiência, melhorias, movimentos avançados, armas, equipamento, vínculos e notas.
- Central do Guardião: arcos, biblioteca de mistérios, mistério ativo, ameaças, cenas, pistas, relógio e sessões.
- Mesa narrativa: cena ativa com imagem, título, descrição, pistas e notas privadas do Guardião.
- Ameaças com tipo, motivação, aparência, descrição, poderes, fraquezas, ataques, armadura, dano e imagem.
- Pistas com título, descrição, imagem e regras de revelação.
- Diário com entradas compartilhadas ou privadas.

## Conteúdo de regras encontrado no código

- Cartilhas existentes em `src/data/motwPlaybooks.ts` (13 IDs definidos em `src/types/motw.ts`).
- Movimentos básicos em `src/data/motwBasicMoves.ts`.
- Referência do Guardião em `src/data/keeperReference.ts`.
- Tipos de domínio em `src/types/motw.ts`.
- Cálculos de dados, dano, experiência e Sorte em `src/utils/dice.ts`.
- Testes de regras em `src/game/rules.test.ts`.

Use esses arquivos como referência técnica e valide as regras com os materiais de referência fornecidos pelo proprietário. Não invente movimentos, cartilhas ou valores ausentes.

## Regras de rolagem representadas no código

- Rolar dois dados de seis faces (2d6), somar o modificador do atributo e o modificador situacional.
- Total 6 ou menos: falha.
- Total 7–9: sucesso parcial.
- Total 10 ou mais: sucesso.
- Total 12 ou mais: resultado avançado apenas quando o Caçador tiver desbloqueado o movimento avançado correspondente.
- Falhas podem conceder experiência conforme as regras implementadas.
- A Sorte deve possuir contador persistente e aplicação controlada; validar a implementação final contra a referência de regras fornecida.

## Direção visual

- Atmosfera de investigação paranormal, suspense e horror urbano, sem excesso de elementos decorativos.
- Fundo escuro carvão/preto, painéis em grafite, detalhes âmbar/dourado e vermelho escuro para ações críticas.
- Hierarquia visual clara, texto legível e cartões compactos.
- Interface mobile-first: nenhuma tela deve ser uma versão desktop comprimida.
- Botões e alvos de toque com pelo menos 44–48 px/dp; textos do corpo preferencialmente 14–16 px.

## Material de referência

O ZIP contém capturas antigas de telas, código-fonte e PDFs fornecidos pelo proprietário. Use as capturas apenas para entender a identidade e funções já imaginadas. As capturas antigas não são o padrão de layout a copiar. Os PDFs são materiais de referência privados do proprietário: não os exponha publicamente, não crie uma biblioteca de download desses arquivos e não reproduza longos trechos de texto protegido.
