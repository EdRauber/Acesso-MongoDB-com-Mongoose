const express = require('express');
const mongoose = require('mongoose');
const Produto = require('../models/Produto');

const router = express.Router();

function precoValido(preco) {
  return typeof preco === 'number'
    && preco >= 0
    && Number.isSafeInteger(Math.round(preco * 100))
    && Number(preco.toFixed(2)) === preco;
}

router.get('/', async (req, res) => {
  const produtos = await Produto.find().sort({ nome: 1 });
  res.json(produtos);
});

router.post('/', async (req, res) => {
  const { nome, descricao, preco, categoria, estoque, fabricante } = req.body ?? {};

  try {
    const produto = await Produto.create({
      nome,
      descricao,
      preco,
      categoria,
      estoque,
      fabricante
    });

    res.status(201).json(produto);
  } catch (erro) {
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: erro.message });
    }

    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível cadastrar o produto.' });
  }
});


router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { preco } = req.body ?? {};

  if (!mongoose.isObjectIdOrHexString(id) || !precoValido(preco)) {
    return res.status(400).json({
      erro: 'Informe um ID válido e um preço não negativo com até duas casas decimais.'
    });
  }

  const produto = await Produto.findByIdAndUpdate(id, { preco }, {
    new: true,
    runValidators: true
  });

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  res.json(produto);
});

module.exports = router;
