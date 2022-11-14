import Entity from "../../@shared/entity/entity.abstract";
import Address from "../value-object/address";
import NotificationError from '../../@shared/notification/notification.error';
import CustomerValidatorFactory from "../factory/customer.validator.factory";

export default class Customer extends Entity{
    private _name: string;
    private _address!: Address;
    private _active = true;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
      super();
      this._id = id;
      this._name = name;  
      this.validate()  

      if(this.notification.hasErrors()) {
         throw new NotificationError(this.notification.getErrors());
      }
    }



    get name(): string {
       return this._name;
    }

    get rewardPoints(): number {
       return this._rewardPoints;
    }

    get Address(): Address {
      return this._address;
    }

    set name(name: string) {
       this._name = name;
    }

    set Address(address: Address) {
        this._address = address;
    }

    changeAddress(address: Address) {
      this._address = address;
    }

    changeName(name: string) {
       this.name = name;
    }

    activate() {
      if (this._address === undefined) {
         throw new Error("Address is mandatory to activate a customer");
       }
       this._active = true;
    }

    deactivate() {
       this._active = false;
    }

    addRewardPoints(points: number) {
       this._rewardPoints+= points;
    }
  

    validate() {
      CustomerValidatorFactory.create().validate(this);
    }

    isActive(): boolean {
      return this._active;
  }
    
}
