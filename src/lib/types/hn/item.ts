
import { ItemSchema as OfficialSchema, type Item as OfficialItem } from '$lib/types/hn/hn';
import { ItemSchema as PwaSchema, type Item as PwaItem } from '$lib/types/hn/hnpwa';
import type { z } from 'zod';

type ItemSource = OfficialItem | PwaItem;
enum ItemType {
  Story = 'story',
  Link = 'link',
  Job = 'job',
  Comment = 'comment',
  Poll = 'poll'
}

export class Item {
  id: number;
  author?: string; // 'by' in the HN API
  descendants?: number; // otherwise known as num_comments
  parent?: number;
  kids?: number[]; // in the HN API, this is an array of comment IDs
  score?: number;
  time?: number;
  title?: string;
  text?: string;
  type?: ItemType;
  url?: string;
  domain?: string;
  deleted?: boolean;
  dead?: boolean;
  comments?: Item[]

  constructor(source: ItemSource) {
    this.id = source.id;
    this.author = 'by' in source ? source.by :
      'user' in source ? source.user ?? undefined
        : undefined;
    this.descendants = 'descendants' in source ? source.descendants
      : 'comments_count' in source ? source.comments_count
        : undefined;
    this.kids = 'kids' in source ? source.kids
      : 'comments' in source ? source.comments?.map(comment => comment.id) ?? undefined
        : undefined;
    this.score = 'score' in source ? source.score
      : 'points' in source ? source.points ?? undefined
        : undefined;
    this.time = 'time' in source ? source.time : undefined;
    this.title = 'title' in source ? source.title : undefined;
    this.text = ('text' in source ? source.text
      : 'content' in source ? source.content ?? undefined
        : undefined) || undefined;
    this.type = 'type' in source ? source.type as ItemType : undefined;
    this.url = 'url' in source ? source.url : undefined;
    this.domain = this.type === ItemType.Link && 'domain' in source
      ? source.domain
      : this.type === ItemType.Story && this.url
        ? new URL(this.url).hostname
        : undefined;
    this.deleted = 'deleted' in source ? source.deleted : undefined;
    this.dead = 'dead' in source ? source.dead : undefined;
    this.parent = 'parent' in source ? source.parent : undefined;

    if ('comments' in source && source.comments) {
      this.comments = source.comments.map(comment => {
        return new Comment(comment);
      })
    } else if ('kids' in source && source.kids){
      this.comments = source.kids?.map(id => {
        return new Comment({ id, parent: this.id, isRoot: false });
      }
      );
    }
    // The PWA API uses 'link' while the official API uses 'story'
    if (this.type === ItemType.Link) {
      this.type = ItemType.Story;
    }
  }


  static createFromOfficial(jsonData: z.infer<typeof OfficialSchema>): Item {
    const parsedData = OfficialSchema.parse(jsonData); // Validate JSON data with Zod
    return new Item(parsedData); // Create and return a Story instance
  }

  static createFromPwa(itemJson: z.infer<typeof PwaSchema>): Item {
    const parsedItem = PwaSchema.parse(itemJson); // Validate item JSON with Zod
    return new Item(parsedItem); // Create and return a Story instance
  }

}


export class Comment extends Item {
  isRoot: boolean;
  root?: number;
  // level: number;

  constructor(source: ItemSource) {
    super(source);
    this.isRoot = false;
    // this.isRoot = level === 0;
    // this.root = source.root;
    // this.level = level;
  }
}