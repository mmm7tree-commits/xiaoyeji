import { Module } from "@nestjs/common";
import { AddressesController } from "./addresses.controller";
import { AddressesDataService } from "./addresses-data.service";
import { AddressesService } from "./addresses.service";

@Module({
  controllers: [AddressesController],
  providers: [AddressesDataService, AddressesService],
  exports: [AddressesService]
})
export class AddressesModule {}
