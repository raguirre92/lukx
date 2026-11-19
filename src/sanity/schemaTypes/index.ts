import { author } from "./documents/author";
import { category } from "./documents/category";
import { post } from "./documents/post";
import { project } from "./documents/project";
import { siteSettings } from "./documents/site-settings";
import { seo } from "./objects/seo";

export const schemaTypes = [post, author, category, project, siteSettings, seo];
