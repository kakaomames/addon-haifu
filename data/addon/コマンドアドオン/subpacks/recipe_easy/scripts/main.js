import { world, system, ItemStack, BlockPermutation, Player } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

var form;


  world.afterEvents.itemUse.subscribe(arg => {
  if (arg.itemStack.typeId === 'minecraft:wooden_pickaxe') {
    form = new ui.ModalFormData();
    form?.title('コマンドボード');
    form?.textField('コマンド', 'コマンドを入力…');
    form?.show(arg.source).then(response => {
      if (!response.canceled) {
        arg.source.runCommand(response.formValues[0]);
        world.sendMessage(String(arg.source.name) + 'がコマンドを実行しました。');
    }
  });
  }
});
