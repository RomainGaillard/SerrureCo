// File location: /api/services/LockService.js

var LockService = {
     format: function(lock){

        lock.has_camera = ToolsService.getBoolean(lock.has_camera);
        lock.has_micro = ToolsService.getBoolean(lock.has_micro);
        lock.has_bell = ToolsService.getBoolean(lock.has_bell);
        lock.is_register = ToolsService.getBoolean(lock.is_register);

        //Date
         if(!ToolsService.isEmpty(lock.createdAt))
         {
             lock.createdAt =ToolsService.formatDate(lock.createdAt);
         }
         if(!ToolsService.isEmpty(lock.updatedAt))
         {
             lock.updatedAt = ToolsService.formatDate(lock.updatedAt);
         }

        return lock;
    }
};
module.exports = LockService;