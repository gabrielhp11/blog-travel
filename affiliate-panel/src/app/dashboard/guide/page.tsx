import { requireAffiliate } from "@/lib/authz";

export default async function AffiliateGuidePage() {
  await requireAffiliate();
  return <>
    <h1 className="page-heading">Como transformar divulgação em vendas</h1>
    <p className="subtitle">Um guia inicial, sem promessa de resultados: escolha um público, ajude-o a decidir e acompanhe o que realmente acontece.</p>

    <section className="card section">
      <h2 className="section-title">Como funciona a indicação</h2>
      <ol className="guide-list">
        <li>Gere um link para a página do blog mais relevante ao assunto que você vai divulgar. O link curto passa pelo painel e registra o clique antes de redirecionar.</li>
        <li>Quando a pessoa visita o blog pelo seu link, o código pode ficar salvo por até 30 dias. A atribuição usa o primeiro clique por padrão; isso não garante que uma rede externa reconhecerá a compra.</li>
        <li>Uma venda só aparece quando a plataforma parceira envia um postback válido. Vendas pendentes não liberam saldo; uma venda confirmada gera 80% de comissão para o afiliado e 20% para o blog.</li>
        <li>Consulte os relatórios de cliques e vendas. Um clique não é uma venda, e os relatórios podem não mostrar acessos bloqueados por navegador ou compras que a plataforma não atribuiu.</li>
      </ol>
    </section>

    <section className="grid section">
      <article className="card">
        <h2 className="section-title">Comece no orgânico</h2>
        <ul className="guide-list">
          <li>Escolha um público e uma dúvida específica que o guia do blog realmente ajude a responder.</li>
          <li>Publique conteúdo útil e original: comparação, checklist, tutorial ou experiência própria claramente identificada. Mostre vantagens, limites e para quem a oferta talvez não sirva.</li>
          <li>Use um convite claro para ler o guia completo. Prefira o link curto para registrar o clique e escolha a página de destino mais relacionada ao conteúdo.</li>
          <li>Divulgue apenas onde as regras da comunidade permitem. Evite spam, mensagens em massa não solicitadas, avaliações falsas e promessas de renda, resultados ou benefícios que não consiga comprovar.</li>
          <li>Informe de forma visível que o link é de afiliado e que você pode receber comissão, sem custo extra para quem compra.</li>
        </ul>
      </article>
      <article className="card">
        <h2 className="section-title">Teste mídia paga com cuidado</h2>
        <ul className="guide-list">
          <li>Antes de anunciar, confirme que a plataforma de afiliados e a rede de anúncios permitem essa origem de tráfego. Confira regras sobre marca, palavras-chave, redirecionamentos e página de destino.</li>
          <li>Comece somente depois de ter uma página útil e uma divulgação orgânica que as pessoas entendam. Teste uma variável por vez, como público ou criativo.</li>
          <li>Defina um orçamento pequeno que possa perder integralmente. Estabeleça um limite de gasto e uma data para pausar; cliques pagos não garantem comissão.</li>
          <li>Confira a política de anúncios e a legislação aplicável. Não esconda a natureza comercial, não copie anúncios alheios e não use segmentação sensível ou alegações enganosas.</li>
          <li>Compare gasto, cliques e vendas confirmadas da rede antes de aumentar o orçamento. Se não houver atribuição confiável ou a conta não fechar, pause e investigue.</li>
        </ul>
      </article>
    </section>

    <section className="card section">
      <h2 className="section-title">Leia os sinais corretamente</h2>
      <ul className="guide-list">
        <li><strong>Poucos cliques:</strong> reveja se o conteúdo alcança o público certo, se o link está visível e se a chamada explica o próximo passo.</li>
        <li><strong>Cliques sem vendas:</strong> confira se a página corresponde à promessa, se a oferta continua disponível e se a rede aceitou o código de referência. Não conclua que precisa comprar mais tráfego.</li>
        <li><strong>Venda sem comissão no painel:</strong> verifique a atribuição e o status no painel da rede. A comissão só aparece aqui depois de um postback válido.</li>
      </ul>
      <p className="muted guide-note">Use os links deste painel; não altere nem encurte o destino de modo que a origem do clique ou a divulgação de afiliado fiquem escondidas. Cada plataforma pode ter regras de atribuição diferentes.</p>
    </section>
  </>;
}
