/**
 * Route defines the structure, and the navigation in the application.
 */
export default class Route {
	public controller: any;
    /**
     * A Block is an interchangeble element on the view.
     */
    Block = class{

        template;
        controller;
        /**
         * Creates a new block.
         * @param {Controller} Controller for the block
         * @param {string} Template to render the data.
         */
        Block(controller,  template) {
            this.controller = controller;
            this.template = template;
        }
    }

    regexp;
    path;
    routeBlocks;
    template;
    name;
    owner;

    Route(name, template, owner) {
        this.name = name;
        this.template = template;
        this.owner = owner;
    }
    /**
     * Adds a an empty Block to the view.
     * @param block Name of the targeted block in the view.
     * @return  Self for chaining functions.
     */
    add(block) {
        routeBlocks.put(block, null);
        return this;
    }
    /**
     * Adds a Block with an attached Controller with default template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controllerClass Controller definition attached to the block.
     * @return Self for chaining functions.

    add( block, controllerClass) {
        return add(block, controllerClass, null);
    }

    /**
     * Adds a Block with an attached Controller with default template.
     * Use this if you dont want to use dependency injection.
     * @param block Name of the targeted block in the view.
     * @param controllerClass Controller definition attached to the block.
     * @param template Name of the template.
     * @return Self for chaining functions.

    public Route add(String block, Class<? extends Controller> controllerClass, String template) {
        try {
            var controller = controllerClass.getDeclaredConstructor().newInstance();
            controller.setEUri(owner.getEUri() == null ? block : owner.getEUri() + "-" + block);
            routeBlocks.put(block, new Block(controller, template));
        }catch (SecurityException | InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | NoSuchMethodException ex) {
            Logger.getLogger(Route.class.getName()).log(Level.SEVERE, null, ex);
        }
        return this;
    }

    /**
     * Adds a Block with an attached Controller with default template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controller Controller instance attached to the block.
     * @return Self for chaining functions.

    public Route add(String block, Controller controller) {
        return add(block, controller, null);
    }

    /**
     * Adds a Block with an attached Controller with a template.
     * Use this to inject dependency trough the contructor of the Controller.
     * @param block Name of the targeted block in the view.
     * @param controller Controller instance attached to the block.
     * @param template Name of the template.
     * @return Self for chaining functions.

    public Route add(String block, Controller controller, String template) {
        controller.setEUri(owner.getEUri() == null ? block : owner.getEUri() + "-" + block);
        routeBlocks.put(block, new Block(controller, template));
        return this;
    }

    /**
     * Adds a tempate which does not require an attached Controller
     *
     * @param block Name of the targeted block in the view.
     * @param template Name of the template.
     * @return Self for chaining functions.

    public Route add(String block, String template) {
        routeBlocks.put(block, new Block(new Controller(), template));
        return this;
    }

    /**
     * Returns the owner and the template name for the required view name
     *
     * @param name Name of the targeted block in the view
     * @return Controller and the requred template
     */
    get(name) {
        return routeBlocks[name];
    }

    /**
     * Mathches the route against the particular request.
     *
     * @param request The request to match against.
     * @return True on match.
     */
    match(request) {
        if (path == null) {
            return true;
        }
        if (path.charAt(1) == '/') {
            if (request.getPath().matches(regexp)) {

            }
        }
        return true;
    }
    
    getTemplate() {
        return template;
    }

}