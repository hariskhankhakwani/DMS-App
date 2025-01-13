import { Container } from "inversify";
import { TYPES } from "./types";
import { ILogger } from '../../../app/ports/logger/ILogger';

const container = new Container()

container.bind