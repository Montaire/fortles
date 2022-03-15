import Application from "./Application.js";
import { Addon } from "./index.js";

/**
 * Addons which has similar functionality can be grouped with this class.
 * Extending this class is good for shared functionality as well.
 * For example One middleware can be shared between multiple Addons this way.
 */
export default class AddonGroup implements Addon{

    protected addons: Addon[];

    public prepare(application: Application): void {
        for(const addon of this.addons){
            addon.prepare(application);
        }
    }

    /**
     * Adds an addon the the group.
     * @param addon The addon. With the template parameter the addons are filtered if needed.
     * @returns Self choning
     */
    public add(addon: Addon<this>): this{
        this.addons.push(addon);
        return this;
    }

}