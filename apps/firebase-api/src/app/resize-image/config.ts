/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum deleteImage {
  always = 0,
  never,
  onSuccess,
}

function deleteOriginalFile(deleteType) {
  deleteImage.never;
}

function paramToArray(param) {
  return typeof param === 'string' ? param.split(',') : undefined;
}

export default {
  bucket: 'openmined-org-dev.appspot.com',
  imageSizes: '400x400',
  deleteOriginalFile: deleteOriginalFile(process.env.DELETE_ORIGINAL_FILE),
  imageType: 'png',
};
