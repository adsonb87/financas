import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export const TagRouter = (prisma: PrismaClient) => {
  const router = express.Router();

  // router.get("/", async (req: Request, res: Response) => {
  //   const result = await prisma.tag.findMany();

  //   res.status(200).json(result);
  // });

  router.get("/", async (req: Request, res: Response) => {
    const result = await prisma.tag.findMany({
      where: {
        nome: {
          contains: "%",
        },
      },
    });

    res.status(200).json(result);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await prisma.tag.findUnique({
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

    const result = await prisma.tag.update({
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
    const body = req.body;
    const result = await prisma.tag.create({
      data: {
        nome: body.toUpperCase(),
      },
    });

    res.status(200).json(result);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await prisma.tag.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!result) {
      res.status(404).end();
    }

    res.status(200).json(result);
  });

  return router;
};
