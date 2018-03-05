<?php
/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: ceive.view-xplate
 */

namespace Ceive\View\XPlate;

use Ceive\View\Layer\Layout;


/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Plate
 * @package Ceive\View\XPlate
 */
class Plate extends Layout{
	
	protected $stylist;
	
	protected $processed = false;
	
	/**
	 * @return mixed|null
	 */
	public function getStylist(){
		return $this->stylist?: ($p = $this->getParentPlate())? $p->getStylist() : null;
	}
	
	/**
	 * @return \Ceive\View\Layer\Element|Plate|null
	 */
	public function getParentPlate(){
		$parent = $this;
		while($parent = $parent->getParent()){
			if($parent instanceof Plate){
				return $parent;
			}
		}
		return null;
	}
	
	
	/**
	 * @return string
	 */
	public function render(){
		
		
		if(!$this->processed){
			$this->_process();
		}
		
		$elements = $this->getElements();
		$a = [];
		foreach($elements as $element){
			$a[] = $element->render();
		}
		
		
		$a = implode("\r\n", $a);
		$a =  str_replace("\r\n", "\r\n\t", $a);
		return
			"<div>\r\n" .
			"\t{$a}\r\n" .
			"</div>";
	}
	
	protected function _process(){ }
	
	
}


