import { Perfil, PrismaClient } from "@prisma/client";
import { UsuarioRequestInput } from "../models/usuario";
import express, { Request, Response } from "express";

export const UsuarioRouter = (prisma: PrismaClient) => {
  const router = express.Router();

  router.get("/", async (req: Request, res: Response) => {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        senha: undefined,
        perfil: true,
      },
    });
    res.status(200).json(usuarios);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!usuario) {
      res.status(404).end();
    }

    res.status(200).json(usuario);
  });

  router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body as UsuarioRequestInput;

    const usuario = await prisma.usuario.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    if (!usuario) {
      res.status(404).end();
    }

    res.status(200).json(usuario);
  });

  router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    let result;

    const { type, ...usuario } = body;

    if (type == 2) {
      result = await prisma.usuario.create({
        data: usuario,
      });
    }
    res.status(200).json(result);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!usuario) {
      res.status(404).end();
    }

    res.status(200).json(usuario);
  });

  /* Reliza a criação do perfil
  router.post("/:id/perfis", async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body as Perfil;
    const result = await prisma.perfil.create({
      data: {
        usuarioId: parseInt(id),
        foto: body.foto
      },
  });

    res.status(200).json(result);
  });*/

  router.post("/:id/perfis", async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body as Perfil;

    //Ao utilizar o upsert é necessário utilizar o create e o update, utilizando o filtro where para
    //validar se existem perfis criados.

    const result = await prisma.perfil.upsert({
      where: {
        usuarioId: parseInt(id),
      },
      create: {
        usuarioId: parseInt(id),
        foto: body.foto,
      },
      update: {
        foto: body.foto,
      },
    });

    res.status(200).json(result);
  });

  router.get("/:id/perfis", async (req: Request, res: Response) => {
    const { id } = req.params;
    const perfil = await prisma.perfil.findUnique({
      where: { usuarioId: parseInt(id) },
    });

    res.status(200).json(perfil);
  });

  router.delete("/:id/perfis", async (req: Request, res: Response) => {
    const { id } = req.params;
    const perfil = await prisma.perfil.delete({
      where: {
        usuarioId: parseInt(id),
      },
    });

    res.status(200).json(perfil);
  });

  return router;
};
