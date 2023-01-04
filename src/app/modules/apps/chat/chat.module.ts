import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from '../chat/chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import {
  DropdownMenusModule,
  ChatInnerModule,
  CardsModule,
} from '../../../_metronic/partials';

@NgModule({
  declarations: [
    ChatComponent,
    PrivateChatComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    DropdownMenusModule,
    ChatInnerModule,
    CardsModule,
    InlineSVGModule,
  ],
})
export class ChatModule {}
