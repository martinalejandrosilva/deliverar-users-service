import { Get, Route, Tags } from "tsoa";

interface IAliveResponse {
  message : string;
}


@Route("ping")
@Tags('API Health')
/**
 * Check if the server is alive.
 * @returns {Promise<IAliveResponse>} The alive message.
 */
export default class AliveController {
  @Get("/")
  public async alive () : Promise<IAliveResponse> {
    return {
      message: 'I am alive!'
    }
  }
}