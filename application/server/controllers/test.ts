const express = require('express');
import { Request, Response } from 'express';

const test = (req: Request, res: Response) => {
  res.json("Hello world!, everything isss looking fine^^");
};

module.exports = {
  test,
};
