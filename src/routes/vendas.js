const express = require('express');
const mongoose = require('mongoose');
const Produto = require('../models/Produto');
const Venda = require('../models/Venda');

const router = express.Router();

router.post('/', async (req, res) => {
const { cliente, itens } = req.body ?? {};

if (typeof cliente !== 'string' || cliente.trim() === '') {
  return res.status(400).json({ erro: 'Informe o nome do cliente.' });
}

  const ids = [];

  for (const item of itens) {
    if (!mongoose.isObjectIdOrHexString(item?.produto)) {
      return res.status(400).json({ erro: 'Informe um ID de produto válido em cada item.' });
    }

    if (!Number.isSafeInteger(item.quantidade) || item.quantidade < 1) {
      return res.status(400).json({ erro: 'A quantidade deve ser um inteiro positivo.' });
    }

    ids.push(item.produto);
  }

  const produtos = await Produto.find({ _id: { $in: ids } });
  const produtosPorId = new Map();

  for (const produto of produtos) {
    produtosPorId.set(produto._id.toString(), produto);
  }

  const itensDaVenda = [];
  let totalCentavos = 0;

  for (const item of itens) {
    const produto = produtosPorId.get(item.produto.toLowerCase());

    if (!produto) {
      return res.status(404).json({ erro: `Produto não encontrado: ${item.produto}` });
    }

    itensDaVenda.push({
      produto: produto._id,
      nomeProduto: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco
    });

    const precoCentavos = Math.round(produto.preco * 100);
    totalCentavos += precoCentavos * item.quantidade;
  }

  if (!Number.isSafeInteger(totalCentavos)) {
    return res.status(400).json({ erro: 'O valor total da venda ultrapassa o limite suportado.' });
  }

  const venda = await Venda.create({
    cliente,
    itens: itensDaVenda,
    total: totalCentavos / 100
  });

  res.status(201).json(venda);
});

router.get('/', async (req, res) => {
  const vendas = await Venda.find()
    .sort({ data: -1, _id: -1 })
    .populate('itens.produto', 'nome preco');

  res.json(vendas);
});

router.get('/relatorio', async (req, res) => {
  const vendas = await Venda.find().sort({ data: -1, _id: -1 }).lean();
  const produtosPorId = new Map();
  let faturamentoCentavos = 0;

  for (const venda of vendas) {
    faturamentoCentavos += Math.round(venda.total * 100);

    for (const item of venda.itens) {
      const id = item.produto.toString();

      if (!produtosPorId.has(id)) {
        produtosPorId.set(id, {
          produtoId: id,
          nome: item.nomeProduto,
          quantidadeVendida: 0
        });
      }

      const produto = produtosPorId.get(id);
      produto.quantidadeVendida += item.quantidade;
    }
  }

  const produtosMaisVendidos = Array.from(produtosPorId.values());
  produtosMaisVendidos.sort((a, b) => b.quantidadeVendida - a.quantidadeVendida);

  res.json({
    quantidadeVendas: vendas.length,
    faturamentoTotal: faturamentoCentavos / 100,
    produtosMaisVendidos
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ erro: 'ID de venda inválido.' });
  }

  const venda = await Venda.findById(id).populate('itens.produto', 'nome preco');

  if (!venda) {
    return res.status(404).json({ erro: 'Venda não encontrada.' });
  }

  res.json(venda);
});

module.exports = router;