import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { TrasnsacaoRequestInput } from "../models/transacao";

export const TransacaoRouter = (prisma: PrismaClient) => {
  const router = express.Router();

  router.get("/", async (req: Request, res: Response) => {
    const result = await prisma.transacao.findMany();

    res.status(200).json(result);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await prisma.transacao.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!result) {
      res.status(404).end();
    }

    res.status(200).json(result);
  });

  router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    const result = await prisma.transacao.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    if (!result) {
      res.status(404).end();
    }

    res.status(200).json(result);
  });

  router.post("/", async (req: Request, res: Response) => {
    const body = req.body as TrasnsacaoRequestInput;
    const result = await prisma.transacao.create({
      data: {
        ...body,
        tags: {
          //create: body.tags.map((tag) => ({nome: tag.toUpperCase(),})),
          //connect: body.tags.map((tag) => ({nome: tag.toUpperCase(),})),

          connectOrCreate: body.tags.map((tag) => ({
            where: {
              nome: tag.toUpperCase(),
            },
            create: {
              nome: tag.toUpperCase(),
            },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    res.status(200).json(result);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await prisma.transacao.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!result) {
      res.status(404).end();
    }

    res.status(200).json(result);
  });

  router.get("/usuario/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await prisma.transacao.findMany({
      where: {
        usuarioId: parseInt(id),
      },
      include: {
        tags: true,
      },
    });

    if (!result) {
      res.status(404).end();
    }

    res.status(200).json(result);
  });

  return router;
};
