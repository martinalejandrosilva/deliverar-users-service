import { Get, Route, Tags } from "tsoa";

interface IAliveResponse {
  message : string;
}

@Route("api/alive")
@Tags('API Health')
export default class AliveController {  
  /**
   * Get API Health Status.
   * @returns A message with the API health status.
   */
    @Get("/")
  public async alive () : Promise<IAliveResponse> {
    return {
      message: 'I am alive!'
    }
  }
}