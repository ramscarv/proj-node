import express from "express";
import { curso } from "../models/index.js";
import { CursoController } from "../controller/curso.controller.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const cursoController = new CursoController(curso);

router.get("/", async (req, res) => {
  const cursos = await cursoController.getAll();
  res.json(cursos);
});

router.post(
  "/create",
  [
    //validação dos dados
    body("nome").notEmpty().trim().withMessage("O campo nome é obrigatório"),
    body("ch")
      .isNumeric()
      .isLength({ min: 2 })
      .withMessage("O campo ch deve ser numérico apenas"),
  ],
  async (req, res) => {
    // caso encontre erros, ficará nessa variável errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //se os dados forem válidos, o sistema executará aqui
    const { nome, ch } = req.body;
    await cursoController.adicionar({ nome, ch });
    res.status(201).send("Curso criado com sucesso!");
  }
);

router.put('/update/:id',
  [
    //validação dos dados
    body("nome").notEmpty().trim().withMessage("O campo nome é obrigatório"),
    body("ch")
      .isNumeric()
      .isLength({ min: 2 })
      .withMessage("O campo ch deve ser numérico apenas"),
  ],
  async (req, res) => {
    // caso encontre erros, ficará nessa variável errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;

    await curso.update(req.body, {
      where: { id: id }
    })
    res.status(200).send("Curso Atualizado com Sucesso!")
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const cursos = await cursoController.get(id);
    res.json(cursos);
  });
  
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await curso.destroy({
    where: {
      id: id
    },
  })
  res.status(200).send("Curso removido com sucesso!");
});

export default router;