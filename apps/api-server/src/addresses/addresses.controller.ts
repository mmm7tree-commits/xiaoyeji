import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { AddressPayload } from "./addresses.types";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  listAddresses(@Headers("x-xiaoyeji-client-id") clientId: string) {
    return this.addressesService.listAddresses(clientId);
  }

  @Post()
  createAddress(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Body() payload: AddressPayload
  ) {
    return this.addressesService.createAddress(clientId, payload);
  }

  @Put(":id")
  updateAddress(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string,
    @Body() payload: AddressPayload
  ) {
    return this.addressesService.updateAddress(clientId, id, payload);
  }

  @Post(":id/default")
  setDefaultAddress(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.addressesService.setDefaultAddress(clientId, id);
  }

  @Delete(":id")
  deleteAddress(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.addressesService.deleteAddress(clientId, id);
  }
}
